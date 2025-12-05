import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  embedding: number[];
  createdAt: Date;
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  tags: [{ type: String }],
  // Store embedding as an array of numbers
  embedding: { type: [Number], index: true }, 
}, { timestamps: true });

export default mongoose.model<INote>('Note', NoteSchema);