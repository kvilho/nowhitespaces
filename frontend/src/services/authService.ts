import api from '../api/axios';

class AuthService {
  // Login method
  async login(email: string, password: string) {
    const response = await api.post("/api/auth/login", { email, password });
    console.log('Login response:', response.data);
    if (response.data.token) {
      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);
      console.log('Stored auth data:', {
        token: response.data.token,
        email: response.data.email,
        role: response.data.role
      });
    }
    return response.data;
  }

  // Logout method
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
  }

  // Get the current user's token
  getToken() {
    return localStorage.getItem("token");
  }

  // Check if the user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    console.log('Checking authentication, token:', token);
    return !!token;
  }

  // Get the user's role from localStorage
  getRole(): string | null {
    return localStorage.getItem("role");
  }
}

export default new AuthService();