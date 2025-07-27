import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
  createDiffModalOpenAtom,
  deleteModalOpenAtom,
  filterStateAtom,
  createDiffModalStateAtom,
  resetModalStateAtom,
  type FilterState,
  type CreateDiffModalState
} from './analysis-ui-state';
import {
  useAnalysisFilesQuery,
  useProjectsQuery,
  useSubprojectsQuery,
  useRevisionsQuery,
  useModalSubprojectsQuery,
  useModalRevisionsQuery,
  useDocumentTypesQuery,
  useDeleteFileMutation,
  useDownloadFileMutation
} from './use-analysis-queries';
import { type FileFilterParams, type File, FileListType } from '../../types/file';

export function useAnalysisState() {
  // UI state atoms
  const [createDiffModalOpen, setCreateDiffModalOpen] = useAtom(createDiffModalOpenAtom);
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(deleteModalOpenAtom);
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [createDiffModalState, setCreateDiffModalState] = useAtom(createDiffModalStateAtom);
  const resetModalStateAction = useSetAtom(resetModalStateAtom);

  const apiFilters: FileFilterParams = {
    document_type: filterState.documentType,
    project_id: filterState.projectId ? parseInt(filterState.projectId) : null,
    subproject_id: filterState.subprojectId ? parseInt(filterState.subprojectId) : null,
    revision_id: filterState.revisionId ? parseInt(filterState.revisionId) : null,
    filter: FileListType.Diff,
  };

  // React Query hooks for main table (analysis-specific - only diff files)
  const {
    data: files = [],
    isLoading: isFilesLoading
  } = useAnalysisFilesQuery(apiFilters);

  const {
    data: projects = [],
    isLoading: isProjectsLoading
  } = useProjectsQuery();

  const {
    data: subprojects = [],
    isLoading: isSubprojectsLoading
  } = useSubprojectsQuery(apiFilters.project_id);

  const {
    data: revisions = [],
    isLoading: isRevisionsLoading
  } = useRevisionsQuery(apiFilters.subproject_id);

  // React Query hooks for create modal (independent)
  const modalProjectId = createDiffModalState.projectId ? parseInt(createDiffModalState.projectId) : null;
  const modalSubprojectId = createDiffModalState.subprojectId ? parseInt(createDiffModalState.subprojectId) : null;

  const {
    data: modalSubprojects = [],
    isLoading: isModalSubprojectsLoading
  } = useModalSubprojectsQuery(modalProjectId);

  const {
    data: modalRevisions = [],
    isLoading: isModalRevisionsLoading
  } = useModalRevisionsQuery(modalSubprojectId);

  const {
    data: documentTypes = [],
    isLoading: isDocumentTypesLoading
  } = useDocumentTypesQuery();

  // Get available files for diff selection based on modal filters
  const modalApiFilters: FileFilterParams = {
    document_type: createDiffModalState.documentType,
    project_id: modalProjectId,
    subproject_id: modalSubprojectId,
    revision_id: createDiffModalState.revisionId ? parseInt(createDiffModalState.revisionId) : null,
    filter: FileListType.Diff,
  };

  const {
    data: availableFilesForDiff = [],
    isLoading: isAvailableFilesLoading
  } = useAnalysisFilesQuery(modalApiFilters);

  // Mutations
  const deleteFileMutation = useDeleteFileMutation();
  const downloadFileMutation = useDownloadFileMutation();

  // Handle diff creation (placeholder for now - will need actual diff creation endpoint)
  const handleCreateDiff = useCallback(async (diffData: {
    name: string;
    document_type: string;
    project_id: number;
    subproject_id: number;
    revision_id: number;
    first_file_id: number;
    second_file_id: number;
  }) => {
    // TODO: Implement actual diff creation when API is ready
    console.log('Creating diff:', diffData);
    // For now, just close the modal
    setCreateDiffModalOpen(false);
  }, [setCreateDiffModalOpen]);

  // Handle file deletion
  const handleDeleteFile = useCallback(async (file: File) => {
    deleteFileMutation.mutate(file.id);
    setDeleteModalOpen(null);
  }, [deleteFileMutation, setDeleteModalOpen]);

  // Handle file download
  const downloadFile = useCallback(async (file: File) => {
    downloadFileMutation.mutate(file.id);
  }, [downloadFileMutation]);

  // Handle modal close
  const handleCloseCreateDiffModal = useCallback(() => {
    setCreateDiffModalOpen(false);
  }, [setCreateDiffModalOpen]);

  // Handle filter changes (for main table)
  const handleSearchChange = useCallback((newSearchFields: FilterState) => {
    console.log('newSearchFields', newSearchFields);
    setFilterState(newSearchFields);
  }, [setFilterState]);

  // Handle modal state changes
  const handleModalStateChange = useCallback((newModalState: Partial<CreateDiffModalState>) => {
    setCreateDiffModalState(prev => ({ ...prev, ...newModalState }));
  }, [setCreateDiffModalState]);

  // Combined loading state
  const isLoading = isFilesLoading || isProjectsLoading || isSubprojectsLoading || 
                   isRevisionsLoading || isDocumentTypesLoading;

  const isModalLoading = isProjectsLoading || isModalSubprojectsLoading || 
                        isModalRevisionsLoading || isDocumentTypesLoading || 
                        isAvailableFilesLoading;

  return {
    // State
    files,
    isLoading,
    isModalLoading,
    createDiffModalOpen,
    deleteModalOpen,
    filterState,
    createDiffModalState,
    projects,
    subprojects,
    revisions,
    modalSubprojects,
    modalRevisions,
    documentTypes,
    availableFilesForDiff,

    // Actions
    setCreateDiffModalOpen,
    setDeleteModalOpen,
    resetModalState: resetModalStateAction,

    // Handlers
    handleCreateDiff,
    handleDeleteFile,
    downloadFile,
    handleCloseCreateDiffModal,
    handleSearchChange,
    handleModalStateChange,
  };
} 