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

interface ProjectMember {
  id: number;
  user: {
    username: string;
    email: string;
  };
  role: string;
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

  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await api.get(`/api/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      throw error;
    }
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    try {
      const response = await api.get(`/api/projects/${projectId}/members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project members:', error);
      throw error;
    }
  }
}

export default new ProjectService();