import { createContext, useState, ReactNode, useContext } from "react";
import { NoteService } from "../services/noteService";
import { Note } from "../models/note";
import { ChatContext } from "./ChatContext";

interface NoteContextType {
  notes: Note[];
  editing: boolean;
  currentContent: string | undefined;
  fetchProjectInitial: (token: string) => void;
  fetchProject: (token: string) => void;
  addNote: (noteText: string, token: string) => void;
  deleteNote: (noteText: string, token: string) => void;
  editNote: (index: string) => void;
  updateNote: (updatedText: string, token: string) => void;
  setCurrentContent: (note: string | undefined) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<string | undefined>("");
  const [currentId, setCurrentId] = useState<string>("");

  const chatContext = useContext(ChatContext);
  if (!chatContext) {
    throw new Error("NoteList must be used within a NoteProvider");
  }
  const { showErrorToast, showSuccessToast } = chatContext;

  //useEffect(() => {
  // fetchProject();
  //}, []);

  const fetchProjectInitial = async (token: string) => {
    try {

      const response = await NoteService.getNotesInitial(token);
      if (response.data.success) {
        setNotes(response.data.notes);
      } else {
        throw new Error("Failed to fetch notes");
      }
    } catch (error) {
      showErrorToast('Failed to fetch notes!');
    }
  };

  const fetchProject = async (token: string) => {
    try {

      const response = await NoteService.getNotes(token);
      if (response.data.success) {
        setNotes(response.data.notes);
      } else {
        throw new Error("Failed to fetch notes");
      }
    } catch (error) {
      showErrorToast('Failed to fetch notes!');
    }
  };

  const addNote = async (noteText: string, token: string) => {
    try {
      const response = await NoteService.addNote(noteText, token);
      if (response.data.success) {
        setNotes([...notes, response.data.note]);
        setCurrentContent("");
        showSuccessToast('Note added successfully');
      } else {
        throw new Error("Failed to add note");
      }
    } catch (error) {
      showErrorToast('Failed to add note!')
    }
  };

  const deleteNote = async (_id: string, token: string) => {
    try {
      const response = await NoteService.deleteNote(_id, token);
      if (response.data.success) {
        const updatedNotes = notes.filter((note: Note) => note._id !== _id);
        setNotes(updatedNotes);
        showSuccessToast('Note deleted successfully.')
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      showErrorToast('Failed to delete note!')
    }
  };

  const editNote = (id: string) => {
    setCurrentId(id);
    const tempNote = notes.find((note: Note) => note._id === id);
    setCurrentContent(tempNote?.content);
    setEditing(true);
  };

  const updateNote = async (updatedText: string, token: string) => {
    try {
      const response = await NoteService.updateNote(currentId, updatedText, token);
      if (response.data.success) {
        const updatedNotes = notes.map((note: Note) => {
          if (note._id === currentId) {
            note.content = updatedText;
          }
          return note;
        });
        setNotes(updatedNotes);
        setEditing(false);
        setCurrentContent("");
        setCurrentId("");
        showSuccessToast('Note updated successfully')
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      showErrorToast('Failed to update note!')
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        editing,
        currentContent,
        fetchProjectInitial,
        fetchProject,
        addNote,
        deleteNote,
        editNote,
        updateNote,
        setCurrentContent,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export { NoteProvider, NoteContext };
