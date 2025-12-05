import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Note {
  _id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  embedding?: number[];
  createdAt: string;
}

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  selectedNote: Note | null;
  
  fetchNotes: () => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  uploadNote: (file: File) => Promise<void>;
  setSelectedNote: (note: Note | null) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  selectedNote: null,

  setSelectedNote: (note) => set({ selectedNote: note }),

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/notes`);
      set({ notes: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  searchNotes: async (query: string) => {
    if (!query.trim()) {
      const res = await axios.get(`${API_URL}/notes`);
      set({ notes: res.data });
      return;
    }
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/search`, { params: { query } });
      set({ notes: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  uploadNote: async (file: File) => {
    set({ isUploading: true, uploadProgress: 0 });
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const current = progressEvent.loaded;
          const percent = Math.round((current * 100) / total);
          const safePercent = percent > 90 ? 90 : percent;
          set({ uploadProgress: safePercent });
        },
      });
      
      set({ uploadProgress: 100 });
      set((state) => ({ notes: [res.data, ...state.notes] }));
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setTimeout(() => set({ isUploading: false, uploadProgress: 0 }), 1000);
    }
  },
}));