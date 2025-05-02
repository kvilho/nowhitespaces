import api from '../api/axios';
import { Entry } from '../types/Entry'; // Import the correct Entry type

class EntryService {
    async createEntry(entry: Omit<Entry, 'entryId' | 'project' | 'user'> & { projectId: number }) {
        const response = await api.post('/api/entries', entry);
        return response.data as Entry; // Ensure the returned data matches the Entry type
    }

    async updateEntry(entryId: number, entry: Partial<Entry>) {
        const response = await api.put(`/api/entries/${entryId}`, entry);
        return response.data as Entry; // Ensure the returned data matches the Entry type
    }

    async deleteEntry(entryId: number) {
        await api.delete(`/api/entries/${entryId}`);
    }

    async getEntriesByProject(projectId: number): Promise<Entry[]> {
        const response = await api.get(`/api/entries/project/${projectId}`);
        return response.data as Entry[]; // Ensure the returned data matches the Entry type
    }

    async getLatestEntries(limit: number = 5): Promise<Entry[]> {
        const response = await api.get(`/api/entries/latest?limit=${limit}`);
        return response.data as Entry[]; // Ensure the returned data matches the Entry type
    }

    async getMyEntries(): Promise<Entry[]> {
        const response = await api.get('/api/entries/my');
        return response.data as Entry[]; // Ensure the returned data matches the Entry type
    }
}

export default new EntryService();