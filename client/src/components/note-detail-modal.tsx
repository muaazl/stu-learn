'use client';
import { useEffect } from 'react';
import { useNoteStore } from '@/store/use-note-store';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal
} from "@/components/ui/animated-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Controller to sync Zustand with Modal Context
const ModalController = () => {
  const { selectedNote } = useNoteStore();
  const { setOpen } = useModal();

  useEffect(() => {
    if (selectedNote) setOpen(true);
    else setOpen(false);
  }, [selectedNote, setOpen]);

  return null;
};

export const NoteDetailModal = () => {
  const { selectedNote, setSelectedNote } = useNoteStore();

  return (
    <Modal>
      <ModalController />
      {selectedNote && (
        <ModalBody className="md:max-w-2xl">
          <ModalContent className="overflow-y-auto max-h-[70vh]">
            <div className="flex flex-col gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedNote.title}</h2>
              <div className="flex gap-2 flex-wrap">
                {selectedNote.tags.map(tag => (
                  <Badge key={tag} variant="info">#{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">AI Summary</h3>
                <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                  {selectedNote.summary}
                </p>
              </div>
              
              {selectedNote.content && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Original Content</h3>
                  <div className="text-gray-500 text-sm font-mono bg-gray-50 p-4 rounded-md whitespace-pre-wrap h-64 overflow-y-auto">
                    {selectedNote.content}
                  </div>
                </div>
              )}
            </div>
          </ModalContent>
          <ModalFooter className="flex justify-between items-center gap-4">
             <span className="text-xs text-gray-400">
                {new Date(selectedNote.createdAt).toLocaleString()}
             </span>
             <Button variant="outline" onClick={() => setSelectedNote(null)}>
               Close
             </Button>
          </ModalFooter>
        </ModalBody>
      )}
    </Modal>
  );
};