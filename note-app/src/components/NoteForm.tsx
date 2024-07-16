import React, { useContext } from 'react';
import { NoteContext } from '../contexts/NoteContext';
interface NoteFormProps {
  token: string | undefined;
}
const NoteForm: React.FC<NoteFormProps> = ({token}) => {
  const noteContext = useContext(NoteContext);

  if (!noteContext) {
    throw new Error('NoteForm must be used within a NoteProvider');
  }

  const { addNote, updateNote, editing, currentContent, setCurrentContent } = noteContext;


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      note: { value: string };
    };
    const noteText = target.note.value.trim();
    if (noteText !== '') {
      if (editing) {
        updateNote(noteText, token?? '');
      } else {
        addNote(noteText, token ?? '');
      }
      target.note.value = '';
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex w-[100%] gap-2 mt-4 mb-6 items-center">
          <input
            type="text"
            name="note"
            className="w-[70%] py-2 px-3 rounded-lg bg-brown-100"
            placeholder="Enter a note"
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
          />

          <button type="submit" className="w-[30%] py-2 px-2 inline-flex items-center justify-center text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600">
            {editing ? 'Update Note' : 'Add Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;












