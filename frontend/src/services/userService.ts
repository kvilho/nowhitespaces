import api from '../api/axios';

export interface UserProfile {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
}

class UserService {
  async getUserProfile() {
    const response = await api.get("/api/user/profile");
    return response.data;
  }

  async updateUserProfile(profile: UserProfile) {
    const response = await api.put("/api/user/profile", profile);
    return response.data;
  }

  async getAllUsers() {
    const response = await api.get("/api/user/all");
    return response.data;
  }
}

export default new UserService();