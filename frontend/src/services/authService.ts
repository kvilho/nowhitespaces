import axiosInstance from "./axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

class AuthService {
  // Login method
  async login(email: string, password: string) {
    const response = await axiosInstance.post("/auth/login", { email, password });
    if (response.data.token) {
      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);
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
    return !!this.getToken();
  }

  // Get the user's role from localStorage
  getRole(): string | null {
    return localStorage.getItem("role");
  }

}

export default new AuthService();