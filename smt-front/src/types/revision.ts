export interface Revision {
  id: number;
  revision_number: number;
  title: string;
  description?: string | null;
  subproject_id: number;
  created_at: string;
  updated_at: string;
}

export interface RevisionCreate {
  revision_number: number;
  title: string;
  description?: string | null;
}

export interface RevisionUpdate {
  title?: string;
  description?: string | null;
}

export interface RevisionResponse {
  revision: Revision;
}

export interface RevisionListResponse {
  revisions: Revision[];
} 