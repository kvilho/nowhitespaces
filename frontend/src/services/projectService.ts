import api from '../api/axios';
import { Entry } from '../types/Entry';

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

export interface ProjectMember {
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

  async getProjectEntries(projectId: string): Promise<Entry[]> {
    try {
      const response = await api.get(`/api/projects/${projectId}/entries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project entries:', error);
      throw error;
    }
  }

  async updateEntryStatus(entryId: number, status: string): Promise<void> {
    try {
      await api.put(`/api/entries/${entryId}/status`, { status });
    } catch (error) {
      console.error('Error updating entry status:', error);
      throw error;
    }
  }

  async createProject(projectData: {
    projectName: string;
    projectCode: string;
    projectDescription: string;
  }): Promise<Project> {
    try {
      const response = await api.post('/api/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
}

export default new ProjectService();