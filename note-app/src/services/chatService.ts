import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; 

export class ChatService {
    private static API_URL = `${BASE_URL}/chat`;

    public static async fetchChats(userId: string): Promise<any> {
        try {
            const response = await axios.get(`${this.API_URL}/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch chats');
        }
    }

    public static async sendChatMessage(sender: string, receiver: string, message: string): Promise<any> {
        try {
            const data = { sender, receiver, message };
            const response = await axios.post(`${this.API_URL}/send`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, 
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to send chat');
        }
    }
}
