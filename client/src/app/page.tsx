'use client';
import { useEffect } from 'react';
import { useNoteStore } from '@/store/use-note-store';
import { NoteCard } from '@/components/ui/note-card';
import { UploadArea } from '@/components/upload-area';
import { SearchBar } from '@/components/search-bar';
import { ClusterMap } from '@/components/cluster-map';
import { NoteDetailModal } from '@/components/note-detail-modal';
import { SkeletonCard } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { notes, fetchNotes, isLoading, setSelectedNote } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans text-gray-900">
      
      <NoteDetailModal />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col gap-4 items-center text-center pt-8">
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Local AI Workspace
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            StuLearn
          </h1>
          <p className="max-w-xl text-lg text-slate-500">
            Upload research papers or notes. <br/>
            Let local AI generate insights, embeddings, and connections.
          </p>
        </div>

        {/* Action Area */}
        <div className="grid gap-8 max-w-2xl mx-auto w-full">
          <SearchBar />
          <UploadArea />
        </div>

        {/* Visuals */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-xl font-semibold tracking-tight text-slate-800">Knowledge Graph</h2>
             <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                {notes.length} Nodes
             </span>
          </div>
          <ClusterMap />
        </div>

        {/* Notes Grid */}
        <section className="space-y-6 pb-20">
          <h2 className="text-xl font-semibold tracking-tight text-slate-800 px-1">Recent Notes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading State
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} className="h-64" />
              ))
            ) : notes.length === 0 ? (
               // Empty State
               <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-slate-300">
                 <p className="text-slate-400">No knowledge found. Upload a PDF to begin.</p>
               </div>
            ) : (
              // Data State
              notes.map((note) => (
                <NoteCard 
                  key={note._id}
                  title={note.title}
                  summary={note.summary}
                  tags={note.tags}
                  date={note.createdAt}
                  onClick={() => setSelectedNote(note)}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}