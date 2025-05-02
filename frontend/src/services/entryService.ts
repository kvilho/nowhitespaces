import api from '../api/axios';
import { Entry } from '../types/Entry'; // Use the shared Entry type

class EntryService {
    async createEntry(entryData: Partial<Entry>): Promise<Entry> {
        const response = await api.post<Entry>('/api/entries', entryData);
        return response.data;
    }

    async updateEntry(entryId: number, entryData: Partial<Entry>): Promise<Entry> {
        const response = await api.put<Entry>(`/api/entries/${entryId}`, entryData);
        return response.data;
    }

    async deleteEntry(entryId: number): Promise<void> {
        await api.delete(`/api/entries/${entryId}`);
    }

    async getEntriesByProject(projectId: number): Promise<Entry[]> {
        const response = await api.get<Entry[]>(`/api/entries/project/${projectId}`);
        return response.data;
    }

    async getLatestEntries(limit: number = 5): Promise<Entry[]> {
        const response = await api.get<Entry[]>(`/api/entries/latest?limit=${limit}`);
        return response.data;
    }

    async getMyEntries(): Promise<Entry[]> {
        const response = await api.get<Entry[]>('/api/entries/my');
        return response.data;
    }
}

export default new EntryService();