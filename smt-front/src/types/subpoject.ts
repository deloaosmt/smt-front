export interface Subproject {
    id: number;
    title: string;
    description?: string | null;
    project_id: number;
    created_at: string;
    updated_at: string;
}

export interface SubprojectCreate {
    title: string;
    description?: string | null;
}

export interface SubprojectUpdate {
    title?: string;
    description?: string | null;
}

export interface SubprojectResponse {
    subproject: Subproject;
}

export interface SubprojectListResponse {
    subprojects: Subproject[];
} 