import api from '../api/axios';

export interface Entry {
  entryId: number;
  entryStart: string;
  entryEnd: string;
  entryDescription?: string;
  status: 'APPROVED' | 'PENDING' | 'DECLINED';
  project: {
    projectId: number;
    projectName: string;
  };
}

class EntryService {
  async createEntry(entry: Omit<Entry, 'entryId' | 'project'> & { projectId: number }) {
    const response = await api.post('/api/entries', entry);
    return response.data;
  }

  async updateEntry(entryId: number, entry: Partial<Entry>) {
    const response = await api.put(`/api/entries/${entryId}`, entry);
    return response.data;
  }

  async deleteEntry(entryId: number) {
    await api.delete(`/api/entries/${entryId}`);
  }

  async getEntriesByProject(projectId: number) {
    const response = await api.get(`/api/entries/project/${projectId}`);
    return response.data;
  }

  async getLatestEntries(limit: number = 5): Promise<Entry[]> {
    const response = await api.get(`/api/entries/latest?limit=${limit}`);
    return response.data;
  }

  async getMyEntries(): Promise<Entry[]> {
    const response = await api.get('/api/entries/my');
    return response.data;
  }
}

export default new EntryService(); 