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
      localStorage.setItem("userId", response.data.userId);
      console.log('Stored auth data:', {
        token: response.data.token,
        email: response.data.email,
        role: response.data.role,
        userId: response.data.userId
      });
    }
    return response.data;
  }

  // Register method
  async register(username: string, firstname: string, lastname: string, email: string, password: string, phone: string) {
    const response = await api.post("/api/auth/register", {
      username,
      firstname,
      lastname,
      email,
      password,
      phone
    });
    return response.data;
  }

  // Logout method
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  }

  // Get the current user's token
  getToken() {
    return localStorage.getItem("token");
  }

  // Get the current user's ID
  getUserId() {
    return localStorage.getItem("userId");
  }

  // Check if the user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) {
      return false; // Return false without logging if no token exists
    }
    console.log('Checking authentication, token:', token);
    return true;
  }

  // Get the user's role from localStorage
  getRole(): string | null {
    return localStorage.getItem("role");
  }
}

export default new AuthService();