import axios from 'axios';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

interface MLResponse {
  summary: string;
  embedding: number[];
  tags: string[];
}

export const processTextWithAI = async (text: string): Promise<MLResponse> => {
  try {
    const response = await axios.post(`${ML_URL}/process`, {
      text,
      // We can make these dynamic later
      candidate_labels: ["Work", "Personal", "Code", "Finance", "Research"] 
    });
    return response.data;
  } catch (error) {
    console.error("ML Service Error:", error);
    throw new Error("Failed to process text with AI service");
  }
};