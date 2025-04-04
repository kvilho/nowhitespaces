import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    role: string;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }

    logout(): void {
        localStorage.removeItem('user');
    }

    getCurrentUser(): AuthResponse | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    getToken(): string | null {
        const user = this.getCurrentUser();
        return user ? user.token : null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getRole(): string | null {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    }
}

export default new AuthService(); 