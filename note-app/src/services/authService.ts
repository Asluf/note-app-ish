import axios from 'axios';


const API_URL = 'http://localhost:8080/auth';

export class AuthService {
    private static API_URL = `${API_URL}`;

    public static async signup(email: string, password: string, username: string): Promise<any> {
        const data = { email, password, username };
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
}