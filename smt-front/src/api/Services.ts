import type { Project, ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse } from "../types/project"
import type { Revision, RevisionCreate, RevisionUpdate, RevisionResponse, RevisionListResponse } from "../types/revision"
import type { Subproject, SubprojectCreate, SubprojectUpdate, SubprojectResponse, SubprojectListResponse } from "../types/subpoject"
import type { File, FileUpload, FileResponse, FileListResponse, DownloadUrlResponse, FileType } from "../types/file"
import { HttpClient } from "./httpClient";

const httpClient = new HttpClient();


// Project Service - matches OpenAPI specification
class ProjectService {
  // GET /api/projects - list all projects
  async getProjects(offset: number = 0, limit: number = 1000): Promise<Project[]> {
    const data: ProjectListResponse = await httpClient.get<ProjectListResponse>(`/api/projects?offset=${offset}&limit=${limit}`);
    return data.projects;
  }

  // GET /api/projects/{project_id} - get a specific project
  async getProject(projectId: number): Promise<Project> {
    const data: ProjectResponse = await httpClient.get<ProjectResponse>(`/api/projects/${projectId}`);
    return data.project;
  }

  // POST /api/projects/create - create a new project
  async createProject(projectData: ProjectCreate): Promise<Project> {
    const data: ProjectResponse = await httpClient.post<ProjectResponse>('/api/projects/create', projectData);
    return data.project;
  }

  // PUT /api/projects/{project_id} - update a project
  async updateProject(projectId: number, projectData: ProjectUpdate): Promise<Project> {
    const data: ProjectResponse = await httpClient.put<ProjectResponse>(`/api/projects/${projectId}`, projectData);
    return data.project;
  }

  // DELETE /api/projects/{project_id} - delete a project
  async deleteProject(projectId: number): Promise<void> {
    await httpClient.delete(`/api/projects/${projectId}`);
  }
}

// Subproject Service - matches OpenAPI specification
class SubprojectService {
  // GET /api/projects/{project_id}/subprojects - list subprojects for a project
  async getSubprojects(projectId: number, offset: number = 0, limit: number = 1000): Promise<Subproject[]> {
    const data: SubprojectListResponse = await httpClient.get<SubprojectListResponse>(`/api/projects/${projectId}/subprojects?offset=${offset}&limit=${limit}`);
    return data.subprojects;
  }

  // GET /api/subprojects/{subproject_id} - get a specific subproject
  async getSubproject(subprojectId: number): Promise<Subproject> {
    const data: SubprojectResponse = await httpClient.get<SubprojectResponse>(`/api/subprojects/${subprojectId}`);
    return data.subproject;
  }

  // POST /api/projects/{project_id}/subprojects/create - create a new subproject
  async createSubproject(projectId: number, subprojectData: SubprojectCreate): Promise<Subproject> {
    const data: SubprojectResponse = await httpClient.post<SubprojectResponse>(`/api/projects/${projectId}/subprojects/create`, subprojectData);
    return data.subproject;
  }

  // PUT /api/subprojects/{subproject_id} - update a subproject
  async updateSubproject(subprojectId: number, subprojectData: SubprojectUpdate): Promise<Subproject> {
    const data: SubprojectResponse = await httpClient.put<SubprojectResponse>(`/api/subprojects/${subprojectId}`, subprojectData);
    return data.subproject;
  }

  // DELETE /api/subprojects/{subproject_id} - delete a subproject
  async deleteSubproject(subprojectId: number): Promise<void> {
    await httpClient.delete(`/api/subprojects/${subprojectId}`);
  }
}

// Revision Service - matches OpenAPI specification
class RevisionService {
  // GET /api/subprojects/{subproject_id}/revisions - list revisions for a subproject
  async getRevisions(subprojectId: number, offset: number = 0, limit: number = 1000): Promise<Revision[]> {
    const data: RevisionListResponse = await httpClient.get<RevisionListResponse>(`/api/subprojects/${subprojectId}/revisions?offset=${offset}&limit=${limit}`);
    return data.revisions;
  }

  // GET /api/revisions/{revision_id} - get a specific revision
  async getRevision(revisionId: number): Promise<Revision> {
    const data: RevisionResponse = await httpClient.get<RevisionResponse>(`/api/revisions/${revisionId}`);
    return data.revision;
  }

  // POST /api/subprojects/{subproject_id}/revisions/create - create a new revision
  async createRevision(subprojectId: number, revisionData: RevisionCreate): Promise<Revision> {
    const data: RevisionResponse = await httpClient.post<RevisionResponse>(`/api/subprojects/${subprojectId}/revisions/create`, revisionData);
    return data.revision;
  }

  // PUT /api/revisions/{revision_id} - update a revision
  async updateRevision(revisionId: number, revisionData: RevisionUpdate): Promise<Revision> {
    const data: RevisionResponse = await httpClient.put<RevisionResponse>(`/api/revisions/${revisionId}`, revisionData);
    return data.revision;
  }

  // DELETE /api/revisions/{revision_id} - delete a revision
  async deleteRevision(revisionId: number): Promise<void> {
    await httpClient.delete(`/api/revisions/${revisionId}`);
  }
}

// File Service - matches OpenAPI specification
class FileService {
  // GET /api/files - list files with optional filters
  async getFiles(offset: number = 0, limit: number = 1000): Promise<File[]> {
    const data: FileListResponse = await httpClient.get<FileListResponse>(`/api/files?offset=${offset}&limit=${limit}`);
    return data.files;
  }

  // GET /api/files/{file_id}/info - get file information
  async getFileInfo(fileId: number): Promise<File> {
    const data: FileResponse = await httpClient.get<FileResponse>(`/api/files/${fileId}/info`);
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

    const data: FileResponse = await httpClient.postFormData<FileResponse>('/api/files', formData);
    return data.file;
  }

  // DELETE /api/files/{file_id} - delete a file
  async deleteFile(fileId: number): Promise<void> {
    await httpClient.delete(`/api/files/${fileId}`);
  }

  // GET /api/files/{file_id}/download - get file download url
  async getDownloadUrl(fileId: number): Promise<DownloadUrlResponse> {
    return httpClient.get<DownloadUrlResponse>(`/api/files/${fileId}/download`);
  }

  // GET /api/document-types - get list of available document types
  async getDocumentTypes(): Promise<FileType[]> {
    const data: { document_types: FileType[] } = await httpClient.get<{ document_types: FileType[] }>('/api/document-types');
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
    const data: { file: File } = await httpClient.post<{ file: File }>('/api/diff', diffData);
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
