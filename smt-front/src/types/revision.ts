export interface Revision {
  id: number;
  revisionNumber: number;
  projectId: number;
  subprojectId: string;
  title: string;
  description: string;
  createdAt: string;
}

// Backend response wrapper type
export interface RevisionResponse {
  revision: Revision;
} 