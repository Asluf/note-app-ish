import axios from "axios";
import { Note } from "../models/note";
import { AppResponse } from "../models/response";
import { useTokenContext } from "../contexts/TokenContext";

export class NoteService {
  private static API_URL = "http://localhost:8080/api/notes";

  private static token: any;

  constructor() {
    console.log('setting token');
    this.initializeToken();
  }

  private async initializeToken(): Promise<void> {
    const { token } = useTokenContext();
    NoteService.token = token;
  }

  public static async getNotesInitial(token: string): Promise<any> {
    // const url= `${this.API_URL}/getnotes`;
    return await axios.get<Partial<Note>, AppResponse<Note>>(this.API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  public static async getNotes(token: string): Promise<any> {
    return await axios.get<Partial<Note>, AppResponse<Note>>(this.API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  public static async addNote(content: string,token: string): Promise<any> {
    const data = {
      content: content,
    };
    return await axios.post<Partial<Note>, AppResponse<Note>>(
      this.API_URL,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  public static async updateNote(id: string, content: string, token:string): Promise<any> {
    const url = `${this.API_URL}/${id}`;
    const data = {
      content: content,
    };
    return await axios.put<Partial<Note>, AppResponse<Note>>(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  public static async deleteNote(id: string, token:string): Promise<any> {
    const url = `${this.API_URL}/${id}`;
    return await axios.delete<Partial<Note>, AppResponse<Note>>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
