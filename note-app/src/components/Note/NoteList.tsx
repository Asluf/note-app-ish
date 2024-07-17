import React, { useContext } from 'react';
import { NoteContext } from '../../contexts/NoteContext';
import NoteCard from './NoteCard';
import { Note } from '../../models/note';
interface NoteListProps {
  token: string | undefined;
}
const NoteList: React.FC<NoteListProps> = ({ token }) => {
  const noteContext = useContext(NoteContext);

  if (!noteContext) {
    throw new Error('NoteList must be used within a NoteProvider');
  }

  const { notes, deleteNote, editNote } = noteContext;

  return (
    <div className='flex flex-col'>
      <p className='flex justify-end font-normal my-2'>Total Notes: {notes.length}</p>
      <ul className="flex flex-col gap-2">
        {notes.map((note: Note, index) => (
          <NoteCard
            key={index}
            note={note.content}
            onDelete={() => deleteNote(note._id, token ?? '')}
            onEdit={() => editNote(note._id)}
          />
        ))}
      </ul>
    </div>

  );
};

export default NoteList;




