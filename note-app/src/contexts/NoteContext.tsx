import { createContext, useState, ReactNode, useEffect } from "react";
import { NoteService } from "../services/noteService";
import { Note } from "../models/note";
import Swal from "sweetalert2";

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
      Swal.fire("Error", "Failed to fetch notes", "error");
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
      Swal.fire("Error", "Failed to fetch notes", "error");
    }
  };

  const addNote = async (noteText: string, token: string) => {
    try {
      const response = await NoteService.addNote(noteText, token);
      if (response.data.success) {
        setNotes([...notes, response.data.note]);
        setCurrentContent("");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Note added successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        throw new Error("Failed to add note");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add note", "error");
    }
  };

  const deleteNote = async (_id: string, token: string) => {
    try {
      const response = await NoteService.deleteNote(_id, token);
      if (response.data.success) {
        const updatedNotes = notes.filter((note: Note) => note._id !== _id);
        setNotes(updatedNotes);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Note deleted successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete note", "error");
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
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Note updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update note", "error");
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
