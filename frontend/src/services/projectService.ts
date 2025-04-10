import api from '../api/axios';

export interface Project {
  projectId: number;
  projectName: string;
  projectCode: string;
  projectDescription: string;
  createdAt: string;
  createdBy: {
    id: number;
    username: string;
    email: string;
  };
}

class ProjectService {
  async getMyProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/api/projects/my-projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw error;
    }
  }
}

export default new ProjectService(); 