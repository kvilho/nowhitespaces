import axiosInstance from "./axiosConfig";

class UserService {
  async getUserProfile() {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  }

  async getAllUsers() {
    const response = await axiosInstance.get("/user/all");
    return response.data;
  }
}

export default new UserService();