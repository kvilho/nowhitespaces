export interface Entry {
    entryId: number;
    entryStart: string | Date;
    entryEnd: string | Date;
    entryDescription: string;
    status: 'APPROVED' | 'PENDING' | 'DECLINED' | string; // Allow loose backend values
    declineComment?: string; // Optional property for declined entries
    user: {
        id: number;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
    };
    project?: {
        projectId: number;
        projectName: string;
    };
}