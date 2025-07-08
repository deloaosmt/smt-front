import type { Project, ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse } from "../types/project"
import type { Revision, RevisionCreate, RevisionUpdate, RevisionResponse, RevisionListResponse } from "../types/revision"
import type { Subproject, SubprojectCreate, SubprojectUpdate, SubprojectResponse, SubprojectListResponse } from "../types/subpoject"
import type { File, FileUpload, FileResponse, FileListResponse, DownloadUrlResponse } from "../types/file"
import { API_URL } from "./host";


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

// Project Service - matches OpenAPI specification
class ProjectService {
  // GET /api/projects - list all projects
  async getProjects(offset: number = 0, limit: number = 1000): Promise<Project[]> {
    const response = await fetch(`${API_URL}/api/projects?offset=${offset}&limit=${limit}`, {
      headers: createHeaders()
    });
    const data: ProjectListResponse = await handleResponse(response);
    return data.projects;
  }

  // GET /api/projects/{project_id} - get a specific project
  async getProject(projectId: number): Promise<Project> {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
      headers: createHeaders()
    });
    const data: ProjectResponse = await handleResponse(response);
    return data.project;
  }

  // POST /api/projects/create - create a new project
  async createProject(projectData: ProjectCreate): Promise<Project> {
    const response = await fetch(`${API_URL}/api/projects/create`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(projectData)
    });
    const data: ProjectResponse = await handleResponse(response);
    return data.project;
  }

  // PUT /api/projects/{project_id} - update a project
  async updateProject(projectId: number, projectData: ProjectUpdate): Promise<Project> {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(projectData)
    });
    const data: ProjectResponse = await handleResponse(response);
    return data.project;
  }

  // DELETE /api/projects/{project_id} - delete a project
  async deleteProject(projectId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: createHeaders()
    });
    await handleResponse(response);
  }
}

// Subproject Service - matches OpenAPI specification
class SubprojectService {
  // GET /api/projects/{project_id}/subprojects - list subprojects for a project
  async getSubprojects(projectId: number, offset: number = 0, limit: number = 1000): Promise<Subproject[]> {
    const response = await fetch(`${API_URL}/api/projects/${projectId}/subprojects?offset=${offset}&limit=${limit}`, {
      headers: createHeaders()
    });
    const data: SubprojectListResponse = await handleResponse(response);
    return data.subprojects;
  }

  // GET /api/subprojects/{subproject_id} - get a specific subproject
  async getSubproject(subprojectId: number): Promise<Subproject> {
    const response = await fetch(`${API_URL}/api/subprojects/${subprojectId}`, {
      headers: createHeaders()
    });
    const data: SubprojectResponse = await handleResponse(response);
    return data.subproject;
  }

  // POST /api/projects/{project_id}/subprojects/create - create a new subproject
  async createSubproject(projectId: number, subprojectData: SubprojectCreate): Promise<Subproject> {
    const response = await fetch(`${API_URL}/api/projects/${projectId}/subprojects/create`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(subprojectData)
    });
    const data: SubprojectResponse = await handleResponse(response);
    return data.subproject;
  }

  // PUT /api/subprojects/{subproject_id} - update a subproject
  async updateSubproject(subprojectId: number, subprojectData: SubprojectUpdate): Promise<Subproject> {
    const response = await fetch(`${API_URL}/api/subprojects/${subprojectId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(subprojectData)
    });
    const data: SubprojectResponse = await handleResponse(response);
    return data.subproject;
  }

  // DELETE /api/subprojects/{subproject_id} - delete a subproject
  async deleteSubproject(subprojectId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/subprojects/${subprojectId}`, {
      method: 'DELETE',
      headers: createHeaders()
    });
    await handleResponse(response);
  }
}

// Revision Service - matches OpenAPI specification
class RevisionService {
  // GET /api/subprojects/{subproject_id}/revisions - list revisions for a subproject
  async getRevisions(subprojectId: number, offset: number = 0, limit: number = 1000): Promise<Revision[]> {
    const response = await fetch(`${API_URL}/api/subprojects/${subprojectId}/revisions?offset=${offset}&limit=${limit}`, {
      headers: createHeaders()
    });
    const data: RevisionListResponse = await handleResponse(response);
    return data.revisions;
  }

  // GET /api/revisions/{revision_id} - get a specific revision
  async getRevision(revisionId: number): Promise<Revision> {
    const response = await fetch(`${API_URL}/api/revisions/${revisionId}`, {
      headers: createHeaders()
    });
    const data: RevisionResponse = await handleResponse(response);
    return data.revision;
  }

  // POST /api/subprojects/{subproject_id}/revisions/create - create a new revision
  async createRevision(subprojectId: number, revisionData: RevisionCreate): Promise<Revision> {
    const response = await fetch(`${API_URL}/api/subprojects/${subprojectId}/revisions/create`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(revisionData)
    });
    const data: RevisionResponse = await handleResponse(response);
    return data.revision;
  }

  // PUT /api/revisions/{revision_id} - update a revision
  async updateRevision(revisionId: number, revisionData: RevisionUpdate): Promise<Revision> {
    const response = await fetch(`${API_URL}/api/revisions/${revisionId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(revisionData)
    });
    const data: RevisionResponse = await handleResponse(response);
    return data.revision;
  }

  // DELETE /api/revisions/{revision_id} - delete a revision
  async deleteRevision(revisionId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/revisions/${revisionId}`, {
      method: 'DELETE',
      headers: createHeaders()
    });
    await handleResponse(response);
  }
}

// File Service - matches OpenAPI specification
class FileService {
  // GET /api/files - list files with optional filters
  async getFiles(offset: number = 0, limit: number = 1000): Promise<File[]> {
    const response = await fetch(`${API_URL}/api/files?offset=${offset}&limit=${limit}`, {
      headers: createHeaders()
    });
    const data: FileListResponse = await handleResponse(response);
    return data.files;
  }

  // GET /api/files/{file_id}/info - get file information
  async getFileInfo(fileId: number): Promise<File> {
    const response = await fetch(`${API_URL}/api/files/${fileId}/info`, {
      headers: createHeaders()
    });
    const data: FileResponse = await handleResponse(response);
    return data.file;
  }

  // POST /api/files - create a new file (upload)
  async uploadFile(fileData: FileUpload, file: Blob): Promise<File> {
    const formData = new FormData();
    formData.append('name', fileData.name);
    formData.append('document_type', fileData.document_type);
    formData.append('file', file);

    if (fileData.revision_id) formData.append('revision_id', fileData.revision_id.toString());
    if (fileData.project_id) formData.append('project_id', fileData.project_id.toString());
    if (fileData.subproject_id) formData.append('subproject_id', fileData.subproject_id.toString());

    const response = await fetch(`${API_URL}/api/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    });
    const data: FileResponse = await handleResponse(response);
    return data.file;
  }

  // DELETE /api/files/{file_id} - delete a file
  async deleteFile(fileId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/files/${fileId}`, {
      method: 'DELETE',
      headers: createHeaders()
    });
    await handleResponse(response);
  }

  // GET /api/files/{file_id}/download - get file download url
  async getDownloadUrl(fileId: number): Promise<DownloadUrlResponse> {
    const response = await fetch(`${API_URL}/api/files/${fileId}/download`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  }

  // GET /api/document-types - get list of available document types
  async getDocumentTypes(): Promise<{ type: string }[]> {
    const response = await fetch(`${API_URL}/api/document-types`, {
      headers: createHeaders()
    });
    const data: { document_types: { type: string }[] } = await handleResponse(response);
    return data.document_types;
  }
}

// Diff Service - matches OpenAPI specification
class DiffService {
  // POST /api/diff - create a diff between two documents
  async createDiff(diffData: {
    name: string;
    doc_id_left: number;
    doc_id_right: number;
    target_revision_id?: number;
    target_subproject_id?: number;
    target_project_id?: number;
  }): Promise<File> {
    const response = await fetch(`${API_URL}/api/diff`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(diffData)
    });
    const data: { file: File } = await handleResponse(response);
    return data.file;
  }
}

// Service instances
export const projectService = new ProjectService();
export const subprojectService = new SubprojectService();
export const revisionService = new RevisionService();
export const fileService = new FileService();
export const diffService = new DiffService();

// Export types for convenience
export type { Project, ProjectCreate, ProjectUpdate } from "../types/project";
export type { Subproject, SubprojectCreate, SubprojectUpdate } from "../types/subpoject";
export type { Revision, RevisionCreate, RevisionUpdate } from "../types/revision";
export type { File, FileUpload } from "../types/file";
