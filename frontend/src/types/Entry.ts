export interface Entry {
    entryId: number;
    entryStart: string | number[];  // Accept both formats
    entryEnd: string | number[];    // Accept both formats
    entryDescription: string;
    status: string;
    user: {
        id: number;
        username: string;
        organization: {
            organizationId: number;
            organizationName: string;
        }
    };
} 