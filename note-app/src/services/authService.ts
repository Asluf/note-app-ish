import axios from 'axios';
import { useTokenContext } from '../contexts/TokenContext';

const API_URL = 'http://localhost:8080/auth';

export class AuthService {
    private static API_URL = `${API_URL}`;

    public static async signup(email: string, password: string): Promise<any> {
        const data = { email, password };
        return await axios.post(`${this.API_URL}/signup`, data, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
    }

    public static async login(email: string, password: string): Promise<any> {
        const data = { email, password };
        return await axios.post(`${API_URL}/login`, data, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
    }
    // public static async logout(): Promise<any> {
    //     try {
    //         const { setToken } = useTokenContext();
    //         setToken('');
    //         localStorage.clear();
    //         return true;
    //         // await axios.post(`${API_URL}/logout`, {
    //         //     withCredentials: true
    //         // });
            

    //     } catch (error) {
    //         console.error('Logout error:', error);
    //         throw error;
    //     }
    // }

}