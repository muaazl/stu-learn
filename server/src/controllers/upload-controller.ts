import { Request, Response } from 'express';
import fs from 'fs';
const pdfParse = require('pdf-parse');
import Note from '../models/note';
import { processTextWithAI } from '../services/ml-service';
import { cosineSimilarity } from '../utils/math';
import axios from 'axios';

// Helper to extract text
const extractText = async (filePath: string, mimeType: string): Promise<string> => {
  if (mimeType === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
  // Assume plain text otherwise
  return fs.readFileSync(filePath, 'utf-8');
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Extract Text
    const text = await extractText(req.file.path, req.file.mimetype);
    
    if (!text.trim()) {
      return res.status(400).json({ message: "File is empty or could not be read" });
    }

    // 2. Process with Python ML Service
    const aiData = await processTextWithAI(text);

    // 3. Save to MongoDB
    const newNote = new Note({
      title: req.file.originalname,
      content: text,
      summary: aiData.summary,
      tags: aiData.tags,
      embedding: aiData.embedding
    });

    await newNote.save();

    // Cleanup temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json(newNote);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    // Return notes without the heavy embedding array to save bandwidth
    const notes = await Note.find().select('-embedding').sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

export const searchNotes = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: "Query string required" });
    }

    // 1. Get embedding for the search query from Python
    const aiResponse = await processTextWithAI(query);
    const queryVector = aiResponse.embedding;

    // 2. Fetch all notes with their embeddings
    // (For production with 10k+ notes, we would use MongoDB Atlas Vector Search. 
    // For this local setup, fetching all is fine.)
    const notes = await Note.find();

    // 3. Calculate similarity and sort
    const results = notes.map(note => {
      const similarity = cosineSimilarity(queryVector, note.embedding);
      return { ...note.toObject(), score: similarity };
    })
    .sort((a, b) => b.score - a.score) // Sort by highest match
    .filter(note => note.score > 0.25); // Filter out irrelevant noise

    // 4. Return top 5 results
    res.json(results.slice(0, 5));

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

export const getGraphData = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find();
    
    if (notes.length < 3) {
      return res.json([]); 
    }

    const embeddings = notes.map(n => n.embedding);

    // Call Python Service
    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/cluster`, {
      embeddings
    });

    // Merge coordinates with Note metadata
    const graphData = notes.map((note, index) => ({
      _id: note._id,
      title: note.title,
      ...mlResponse.data[index] // adds x, y, cluster
    }));

    res.json(graphData);
  } catch (error) {
    console.error("Graph error:", error);
    res.status(500).json({ message: "Failed to generate graph" });
  }
};