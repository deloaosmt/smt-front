import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import {
  createModalOpenAtom,
  deleteModalOpenAtom,
  selectedFileAtom,
  filterStateAtom,
  createModalStateAtom,
  resetModalStateAtom,
  currentPageAtom,
  itemsPerPageAtom,
  resetPageAtom,
  type FilterState,
  type CreateModalState
} from './files-ui-state';
import {
  useFilesQuery,
  useProjectsQuery,
  useSubprojectsQuery,
  useRevisionsQuery,
  useModalSubprojectsQuery,
  useModalRevisionsQuery,
  useDocumentTypesQuery,
  useCreateFileMutation,
  useDeleteFileMutation,
  useDownloadFileMutation
} from './use-files-queries';
import type { FileFilterParams, File } from '../../types/file';

export function useFilesState() {
  // UI state atoms
  const [createModalOpen, setCreateModalOpen] = useAtom(createModalOpenAtom);
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(deleteModalOpenAtom);
  const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [createModalState, setCreateModalState] = useAtom(createModalStateAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [itemsPerPage] = useAtom(itemsPerPageAtom);
  const resetModalStateAction = useSetAtom(resetModalStateAtom);
  const resetPageAction = useSetAtom(resetPageAtom);

  // Convert UI filter state to API filter params (for main table)
  const apiFilters: FileFilterParams = {
    document_type: filterState.documentType,
    project_id: filterState.projectId ? parseInt(filterState.projectId) : null,
    subproject_id: filterState.subprojectId ? parseInt(filterState.subprojectId) : null,
    revision_id: filterState.revisionId ? parseInt(filterState.revisionId) : null,
    filter: null,
    offset: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage,
  };

  // React Query hooks for main table
  const {
    data: files = [],
    isLoading: isFilesLoading
  } = useFilesQuery(apiFilters);

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
  const modalProjectId = createModalState.projectId ? parseInt(createModalState.projectId) : null;
  const modalSubprojectId = createModalState.subprojectId ? parseInt(createModalState.subprojectId) : null;

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

  // Mutations
  const createFileMutation = useCreateFileMutation();
  const deleteFileMutation = useDeleteFileMutation();
  const downloadFileMutation = useDownloadFileMutation();

  // Reset to first page when filters change
  useEffect(() => {
    resetPageAction();
  }, [filterState.documentType, filterState.projectId, filterState.subprojectId, filterState.revisionId, resetPageAction]);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (files.length === itemsPerPage) { // Only allow next if we got a full page
      setCurrentPage(prev => prev + 1);
    }
  }, [files.length, itemsPerPage, setCurrentPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage, setCurrentPage]);

  const handleGoToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  // Handle file creation with direct data (for modal)
  const handleCreateFileWithData = useCallback(async (fileData: {
    name: string;
    document_type: string;
    project_id: number;
    subproject_id: number;
    revision_id: number;
  }, file: globalThis.File) => {
    createFileMutation.mutate({ fileData, file });
    setSelectedFile(null);
    setCreateModalOpen(false);
  }, [createFileMutation, setSelectedFile, setCreateModalOpen]);

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
  const handleCloseCreateModal = useCallback(() => {
    setSelectedFile(null);
    setCreateModalOpen(false);
  }, [setSelectedFile, setCreateModalOpen]);

  // Handle filter changes (for main table)
  const handleSearchChange = useCallback((newSearchFields: FilterState) => {
    console.log('newSearchFields', newSearchFields);
    setFilterState(newSearchFields);
  }, [setFilterState]);

  // Handle modal state changes
  const handleModalStateChange = useCallback((newModalState: Partial<CreateModalState>) => {
    setCreateModalState(prev => ({ ...prev, ...newModalState }));
  }, [setCreateModalState]);

  // Combined loading state
  const isLoading = isFilesLoading || isProjectsLoading || isSubprojectsLoading || 
                   isRevisionsLoading || isDocumentTypesLoading;

  const isModalLoading = isProjectsLoading || isModalSubprojectsLoading || 
                        isModalRevisionsLoading || isDocumentTypesLoading;

  // Pagination state
  const hasNextPage = files.length === itemsPerPage;
  const hasPrevPage = currentPage > 1;

  return {
    // State
    files,
    isLoading,
    isModalLoading,
    createModalOpen,
    deleteModalOpen,
    selectedFile,
    filterState,
    createModalState,
    projects,
    subprojects,
    revisions,
    modalSubprojects,
    modalRevisions,
    documentTypes,

    // Pagination state
    currentPage,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,

    // Actions
    setCreateModalOpen,
    setDeleteModalOpen,
    setSelectedFile,
    resetModalState: resetModalStateAction,

    // Pagination actions
    handleNextPage,
    handlePrevPage,
    handleGoToPage,

    // Handlers
    handleCreateFileWithData,
    handleDeleteFile,
    downloadFile,
    handleCloseCreateModal,
    handleSearchChange,
    handleModalStateChange,
  };
} 