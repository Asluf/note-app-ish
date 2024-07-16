// import React from 'react';

// interface NoteProps {
//   note: string;
//   onDelete: () => void;
//   onEdit: () => void;
// }

// const NoteCard: React.FC<NoteProps> = ({ note, onDelete, onEdit }) => (
//   <li className="list-group-item d-flex justify-content-between align-items-center">
//     {note}
//     <div>
//       <button className="btn btn-sm btn-warning me-2" onClick={onEdit}>
//         Edit
//       </button>
//       <button className="btn btn-sm btn-danger" onClick={onDelete}>
//         Delete
//       </button>
//     </div>
//   </li>
// );

// export default NoteCard;
import React from 'react';

interface NoteProps {
  note: string;
  onDelete: () => void;
  onEdit: () => void;
}

const NoteCard: React.FC<NoteProps> = ({ note, onDelete, onEdit }) => (
  <li className="flex justify-between items-center w-[100%] bg-brown-300 rounded-lg py-3 px-5 shadow-lg">
    <div className="flex flex-col w-[60%]">
      {note}
    </div>
    <div className="flex gap-2 ">
      <button className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-700" onClick={onEdit}>
        Edit
      </button>
      <button className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-700 text-white hover:bg-red-800" onClick={onDelete}>
        Delete
      </button>
    </div>
  </li>
);

export default NoteCard;
