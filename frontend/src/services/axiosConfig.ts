import axios from "axios";
import authService from "./authService"; // Import AuthService for token management

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api", // Set your API base URL
});

// Add a request interceptor to include the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken(); // Get the token from AuthService
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized errors
      authService.logout(); // Log the user out
      window.location.href = "/login"; // Redirect to the login page
    }
    return Promise.reject(error); // Pass through other errors
  }
);

export default axiosInstance; // Export the configured Axios instance