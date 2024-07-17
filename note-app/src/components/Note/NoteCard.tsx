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
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      <button className="py-2 px-4 inline-flex items-center justify-center text-sm font-semibold rounded-lg border border-transparent bg-yellow-600 text-white hover:bg-yellow-700" onClick={onEdit}>
        <FontAwesomeIcon
          icon={faPen}
          className="text-[16px]"
        />
      </button>
      <button className="py-2 px-4 inline-flex items-center justify-center text-sm font-semibold rounded-lg border border-transparent bg-red-700 text-white hover:bg-red-800" onClick={onDelete}>
        <FontAwesomeIcon
          icon={faTrash}
          className="text-[16px]"
        />
      </button>
    </div>
  </li>
);

export default NoteCard;
