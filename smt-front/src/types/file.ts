export interface File {
  id: number;
  filename?: string | null;
  name: string;
  mime_type: string;
  file_size: number;
  s3_key: string;
  s3_bucket: string;
  document_type?: string | null;
  created_at: string;
  updated_at: string;
  revision_id?: number | null;
  revision_name?: string | null;
  project_id?: number | null;
  project_name?: string | null;
  subproject_id?: number | null;
  subproject_name?: string | null;
}

export interface FileType {
  name: string;
  type: string;
}

export interface FileUpload {
  name: string;
  document_type: string;
  revision_id?: number | null;
  project_id?: number | null;
  subproject_id?: number | null;
}

export interface FileResponse {
  file: File;
}

export interface FileListResponse {
  files: File[];
}

export interface DownloadUrlResponse {
  download_url: string;
  expires_in: number;
}

export interface UploadInfo {
  title: string;
  description: string;
  documentType: string;
  requiredFileFormats: string[];
  file?: File;
}

export interface GenerateInfo {
  title: string;
  description: string;
  file?: File;
}

export interface TopSideInfo {
  left: UploadInfo;
  right: GenerateInfo;
}

export interface FileFilterParams {
  document_type: string | null;
  project_id: number | null;
  subproject_id: number | null;
  revision_id: number | null;
  filter: FileListType | null;
  offset?: number;
  limit?: number;
}

export enum FileListType {
  Base = 'base',
  Diff = 'diff'
}
