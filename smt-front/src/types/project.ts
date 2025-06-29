export interface Project {
  id: number;
  title: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  title: string;
  description?: string | null;
}

export interface ProjectUpdate {
  title?: string;
  description?: string | null;
}

export interface ProjectResponse {
  project: Project;
}

export interface ProjectListResponse {
  projects: Project[];
} 