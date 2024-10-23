import { Request, Response } from "express";
import Note from "../models/noteModels";

// Type guard to check if the error is an instance of Error
const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const userId = req.user._id; // Get user ID from the request
    const note = new Note({
      content,
      user: userId,
    }); // creating new Note model
    await note.save(); //saving in DB
    res.send({ success: true, note }); //sending back to frontend
  } catch (error) {
    if (isError(error)) {
      res.send({ success: false, message: error.message });
    } else {
      res.send({ success: false, message: "An unknown error occurred" });
    }
  }
};

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({ user: userId });
    res.send({ success: true, notes });
  } catch (error) {
    if (isError(error)) {
      res.send({ success: false, message: error.message });
    } else {
      res.send({ success: false, message: "An unknown error occurred" });
    }
  }
};

export const updateNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id;
    const noteId = req.params.id;
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      res.send({ success: false, message: "Note not found" });
      return;
    }
    note.content = req.body.content;
    await note.save();
    res.send({ success: true, note });
  } catch (error) {
    if (isError(error)) {
      res.send({ success: false, message: error.message });
    } else {
      res.send({ success: false, message: "An unknown error occurred" });
    }
  }
};

export const deleteNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id;
    const noteId = req.params.id;
    const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
    if (!note) {
      res.send({ success: false, message: "Note not found" });
      return;
    }
    res.send({ success: true, note, message: "Note deleted" });
  } catch (error) {
    if (isError(error)) {
      res.send({ success: false, message: error.message });
    } else {
      res.send({ success: false, message: "An unknown error occurred" });
    }
  }
};
