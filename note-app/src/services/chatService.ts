import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export class ChatService {
    private static API_URL = `${BASE_URL}/chat`;

    public static async fetchChats(userId: string, token: string): Promise<any> {
        try {
            const response = await axios.get(`${this.API_URL}/getChats/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch chats');
        }
    }

    public static async fetchUsers(token: string): Promise<any> {
        try {
            const response = await axios.get(`${this.API_URL}/getUsers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch chats');
        }
    }
    public static async createChat(data: any, token: string): Promise<any> {
        return await axios.post(`${this.API_URL}/createChat`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

}
