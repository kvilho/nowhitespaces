import config from '../config';

interface LoginResponse {
    token: string;
    user: {
        username: string;
        role: string;
    };
}

class AuthService {
    private static instance: AuthService;
    private token: string | null = null;

    private constructor() {
        // Check if there's a stored token
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            this.token = storedToken;
        }
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async login(username: string, password: string): Promise<LoginResponse> {
        try {
            console.log('Attempting login with:', { username, password });
            
            // For demo purposes, we'll use a simple token based on the username
            // In a real application, this would be handled by the backend
            if (username === 'employer' && password === 'employer') {
                console.log('Login successful for employer');
                const token = btoa('employer:employer');
                this.token = token;
                localStorage.setItem('token', token);
                return {
                    token,
                    user: {
                        username: 'employer',
                        role: 'EMPLOYER'
                    }
                };
            } else if (username === 'employee' && password === 'employee') {
                console.log('Login successful for employee');
                const token = btoa('employee:employee');
                this.token = token;
                localStorage.setItem('token', token);
                return {
                    token,
                    user: {
                        username: 'employee',
                        role: 'EMPLOYEE'
                    }
                };
            } else {
                console.log('Invalid credentials:', { username, password });
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    public logout(): void {
        this.token = null;
        localStorage.removeItem('token');
    }

    public getToken(): string | null {
        return this.token;
    }

    public isAuthenticated(): boolean {
        return !!this.token;
    }
}

export default AuthService; 