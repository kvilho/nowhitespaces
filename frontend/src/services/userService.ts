import api from '../api/axios';

export interface UserProfile {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: {
    roleId: number;
    roleName: string;
    roleDescription?: string;
  };
}

export interface ProjectHoursDTO {
  projectId: number;
  projectName: string;
  hours: number;
}

export interface StatusSummaryDTO {
  totalHours: number;
  monthlyBreakdown: { [key: string]: number };
  perProject: ProjectHoursDTO[];
}

export interface HourSummaryDTO {
  approved: StatusSummaryDTO;
  pending: StatusSummaryDTO;
  declined: StatusSummaryDTO;
}

class UserService {
  async getUserProfile() {
    const response = await api.get("/api/users/profile");
    return response.data;
  }

  async updateUserProfile(profile: UserProfile) {
    const response = await api.put("/api/users/profile", profile);
    return response.data;
  }

  async getAllUsers() {
    const response = await api.get("/api/users");
    return response.data;
  }

  async getUserHourSummary(): Promise<HourSummaryDTO> {
    const response = await api.get("/api/users/profile/hours-summary");
    return response.data;
  }
}

export default new UserService();