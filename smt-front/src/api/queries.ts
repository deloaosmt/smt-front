import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileService, projectService, subprojectService, revisionService } from './Services';
import useNotification from '../notifications/hook';
import { getErrorMessage } from '../common/OnError';
import type { FileFilterParams, FileUpload } from '../types/file';

// Query keys
export const queryKeys = {
  files: ['files'] as const,
  projects: ['projects'] as const,
  subprojects: (projectId: number) => ['subprojects', projectId] as const,
  revisions: (subprojectId: number) => ['revisions', subprojectId] as const,
  documentTypes: (showDiff: boolean) => ['documentTypes', showDiff] as const,
  modalSubprojects: (projectId: number) => ['subprojects', projectId, 'modal'] as const,
  modalRevisions: (subprojectId: number) => ['revisions', subprojectId, 'modal'] as const,
} as const;

// Base queries
export function useFilesQuery(filters: FileFilterParams = {
  document_type: null,
  project_id: null,
  subproject_id: null,
  revision_id: null,
  filter: null,
  offset: undefined,
  limit: undefined
}) {
  return useQuery({
    queryKey: [...queryKeys.files, filters],
    queryFn: () => fileService.getFiles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => projectService.getProjects(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSubprojectsQuery(projectId: number | null) {
  return useQuery({
    queryKey: queryKeys.subprojects(projectId!),
    queryFn: () => subprojectService.getSubprojects(projectId!),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRevisionsQuery(subprojectId: number | null) {
  return useQuery({
    queryKey: queryKeys.revisions(subprojectId!),
    queryFn: () => revisionService.getRevisions(subprojectId!),
    enabled: !!subprojectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Document types with showDiff parameter
export function useDocumentTypesQuery(showDiff: boolean = false) {
  return useQuery({
    queryKey: queryKeys.documentTypes(showDiff),
    queryFn: () => fileService.getDocumentTypes(showDiff),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Modal-specific queries (independent from main queries)
export function useModalSubprojectsQuery(projectId: number | null) {
  return useQuery({
    queryKey: queryKeys.modalSubprojects(projectId!),
    queryFn: () => subprojectService.getSubprojects(projectId!),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useModalRevisionsQuery(subprojectId: number | null) {
  return useQuery({
    queryKey: queryKeys.modalRevisions(subprojectId!),
    queryFn: () => revisionService.getRevisions(subprojectId!),
    enabled: !!subprojectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// File mutations
export function useCreateFileMutation() {
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotification();

  return useMutation({
    mutationFn: ({ fileData, file }: { fileData: FileUpload; file: Blob }) =>
      fileService.uploadFile(fileData, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files });
      notifySuccess('Файл успешно создан!');
    },
    onError: (error) => {
      notifyError(getErrorMessage(error));
    },
  });
}

export function useDeleteFileMutation() {
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotification();

  return useMutation({
    mutationFn: (fileId: number) => fileService.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files });
      notifySuccess('Файл успешно удален!');
    },
    onError: (error) => {
      notifyError(getErrorMessage(error));
    },
  });
}

export function useDownloadFileMutation() {
  const { notifyError } = useNotification();

  return useMutation({
    mutationFn: (fileId: number) => fileService.getDownloadUrl(fileId),
    onSuccess: (downloadUrl) => {
      window.open(downloadUrl.download_url, '_blank');
    },
    onError: (error) => {
      notifyError(getErrorMessage(error));
    },
  });
} 