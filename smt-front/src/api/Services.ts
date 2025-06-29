import type { Project, ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse } from "../types/project"
import type { Revision, RevisionCreate, RevisionUpdate, RevisionResponse, RevisionListResponse } from "../types/revision"
import type { Subproject, SubprojectCreate, SubprojectUpdate, SubprojectResponse, SubprojectListResponse } from "../types/subpoject"
import type { File, FileUpload, FileResponse, FileListResponse, DownloadUrlResponse } from "../types/file"

// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to create headers
const createHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Base CRUD Service Interface
interface CrudService<T> {
    getItems(): Promise<T[]>
    getItem(id: string): Promise<T>
    updateItem(item: T): Promise<T>
    deleteItem(id: string): Promise<void>
}

// Project Service Implementation
class ApiProjectService implements CrudService<Project> {
    async getItems(): Promise<Project[]> {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            headers: createHeaders()
        });
        const data: ProjectListResponse = await handleResponse(response);
        return data.projects;
    }

    async getItem(id: string): Promise<Project> {
        const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
            headers: createHeaders()
        });
        const data: ProjectResponse = await handleResponse(response);
        return data.project;
    }

    async createItem(item: ProjectCreate): Promise<Project> {
        const response = await fetch(`${API_BASE_URL}/api/projects/create`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(item)
        });
        const data: ProjectResponse = await handleResponse(response);
        return data.project;
    }

    async updateItem(item: Project): Promise<Project> {
        const updateData: ProjectUpdate = {
            title: item.title,
            description: item.description
        };
        const response = await fetch(`${API_BASE_URL}/api/projects/${item.id}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(updateData)
        });
        const data: ProjectResponse = await handleResponse(response);
        return data.project;
    }

    async deleteItem(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
        await handleResponse(response);
    }
}

// Subproject Service Implementation
class ApiSubprojectService implements CrudService<Subproject> {
    async getItems(): Promise<Subproject[]> {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            headers: createHeaders()
        });
        const projects: ProjectListResponse = await handleResponse(response);
        
        // Get all subprojects for all projects
        const allSubprojects: Subproject[] = [];
        for (const project of projects.projects) {
            const subprojectsResponse = await fetch(`${API_BASE_URL}/api/projects/${project.id}/subprojects`, {
                headers: createHeaders()
            });
            const subprojectsData: SubprojectListResponse = await handleResponse(subprojectsResponse);
            allSubprojects.push(...subprojectsData.subprojects);
        }
        return allSubprojects;
    }

    async getItem(id: string): Promise<Subproject> {
        const response = await fetch(`${API_BASE_URL}/api/subprojects/${id}`, {
            headers: createHeaders()
        });
        const data: SubprojectResponse = await handleResponse(response);
        return data.subproject;
    }

    async createItem(item: SubprojectCreate & { project_id: number }): Promise<Subproject> {
        const response = await fetch(`${API_BASE_URL}/api/projects/${item.project_id}/subprojects/create`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify({
                title: item.title,
                description: item.description
            })
        });
        const data: SubprojectResponse = await handleResponse(response);
        return data.subproject;
    }

    async updateItem(item: Subproject): Promise<Subproject> {
        const updateData: SubprojectUpdate = {
            title: item.title,
            description: item.description
        };
        const response = await fetch(`${API_BASE_URL}/api/subprojects/${item.id}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(updateData)
        });
        const data: SubprojectResponse = await handleResponse(response);
        return data.subproject;
    }

    async deleteItem(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/subprojects/${id}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
        await handleResponse(response);
    }

    // Get subprojects for a specific project
    async getSubprojectsByProject(projectId: number): Promise<Subproject[]> {
        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/subprojects`, {
            headers: createHeaders()
        });
        const data: SubprojectListResponse = await handleResponse(response);
        return data.subprojects;
    }
}

// Revision Service Implementation
class ApiRevisionService implements CrudService<Revision> {
    async getItems(): Promise<Revision[]> {
        // Get all subprojects first, then get revisions for each
        const subprojectService = new ApiSubprojectService();
        const allSubprojects = await subprojectService.getItems();
        
        const allRevisions: Revision[] = [];
        for (const subproject of allSubprojects) {
            const revisionsResponse = await fetch(`${API_BASE_URL}/api/subprojects/${subproject.id}/revisions`, {
                headers: createHeaders()
            });
            const revisionsData: RevisionListResponse = await handleResponse(revisionsResponse);
            allRevisions.push(...revisionsData.revisions);
        }
        return allRevisions;
    }

    async getItem(id: string): Promise<Revision> {
        const response = await fetch(`${API_BASE_URL}/api/revisions/${id}`, {
            headers: createHeaders()
        });
        const data: RevisionResponse = await handleResponse(response);
        return data.revision;
    }

    async createItem(item: RevisionCreate & { subproject_id: number }): Promise<Revision> {
        const response = await fetch(`${API_BASE_URL}/api/subprojects/${item.subproject_id}/revisions/create`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify({
                revision_number: item.revision_number,
                title: item.title,
                description: item.description
            })
        });
        const data: RevisionResponse = await handleResponse(response);
        return data.revision;
    }

    async updateItem(item: Revision): Promise<Revision> {
        const updateData: RevisionUpdate = {
            title: item.title,
            description: item.description
        };
        const response = await fetch(`${API_BASE_URL}/api/revisions/${item.id}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(updateData)
        });
        const data: RevisionResponse = await handleResponse(response);
        return data.revision;
    }

    async deleteItem(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/revisions/${id}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
        await handleResponse(response);
    }

    // Get revisions for a specific subproject
    async getRevisionsBySubproject(subprojectId: number): Promise<Revision[]> {
        const response = await fetch(`${API_BASE_URL}/api/subprojects/${subprojectId}/revisions`, {
            headers: createHeaders()
        });
        const data: RevisionListResponse = await handleResponse(response);
        return data.revisions;
    }
}

// File Service Implementation
class ApiFileService implements CrudService<File> {
    async getItems(): Promise<File[]> {
        const response = await fetch(`${API_BASE_URL}/api/files`, {
            headers: createHeaders()
        });
        const data: FileListResponse = await handleResponse(response);
        return data.files;
    }

    async getItem(id: string): Promise<File> {
        const response = await fetch(`${API_BASE_URL}/api/files/${id}/info`, {
            headers: createHeaders()
        });
        const data: FileResponse = await handleResponse(response);
        return data.file;
    }

    async createItem(item: FileUpload): Promise<File> {
        const formData = new FormData();
        formData.append('name', item.name);
        formData.append('document_type', item.document_type);
        if (item.revision_id) formData.append('revision_id', item.revision_id.toString());
        if (item.project_id) formData.append('project_id', item.project_id.toString());
        if (item.subproject_id) formData.append('subproject_id', item.subproject_id.toString());

        const response = await fetch(`${API_BASE_URL}/api/files`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });
        const data: FileResponse = await handleResponse(response);
        return data.file;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateItem(_item: File): Promise<File> {
        // Note: The API doesn't seem to have an update endpoint for files
        // This might need to be implemented differently or removed
        throw new Error('File update not supported by the API');
    }

    async deleteItem(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/files/${id}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
        await handleResponse(response);
    }

    // Get download URL for a file
    async getDownloadUrl(fileId: number): Promise<DownloadUrlResponse> {
        const response = await fetch(`${API_BASE_URL}/api/files/${fileId}/download`, {
            headers: createHeaders()
        });
        return handleResponse(response);
    }
}

// Service instances
export const projectService: ApiProjectService = new ApiProjectService();
export const subprojectService: ApiSubprojectService = new ApiSubprojectService();
export const revisionService: ApiRevisionService = new ApiRevisionService();
export const fileService: ApiFileService = new ApiFileService();

// Export types for convenience
export type { Project, ProjectCreate, ProjectUpdate } from "../types/project";
export type { Subproject, SubprojectCreate, SubprojectUpdate } from "../types/subpoject";
export type { Revision, RevisionCreate, RevisionUpdate } from "../types/revision";
export type { File, FileUpload } from "../types/file";
