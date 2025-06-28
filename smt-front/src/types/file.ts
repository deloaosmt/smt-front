export interface File {
  id: number;
  uuid: string;
  originalFilename: string;
  displayName: string;
  mimeType: string;
  fileSize: number;
  s3Key: string;
  s3Bucket: string;
  documentType?: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  subprojectId?: string;
  revisionId?: number;
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

// Backend response wrapper types
export interface FileResponse {
  file: File;
} 