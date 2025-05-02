export interface Entry {
    entryId: number;
    entryStart: string | Date;
    entryEnd: string | Date;
    entryDescription: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED';
    user: {
        id: number;
        username: string;
        email: string;
    };
    project: {
        projectId: number;
        projectName: string;
    };
} 