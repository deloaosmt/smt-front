// Re-export shared queries for backward compatibility
export {
  queryKeys,
  useFilesQuery,
  useProjectsQuery,
  useSubprojectsQuery,
  useRevisionsQuery,
  useModalSubprojectsQuery,
  useModalRevisionsQuery,
  useCreateFileMutation,
  useDeleteFileMutation,
  useDownloadFileMutation
} from '../../api/queries';

// Files page specific document types query (non-diff only)
import { useDocumentTypesQuery as useBaseDocumentTypesQuery } from '../../api/queries';

export function useDocumentTypesQuery() {
  return useBaseDocumentTypesQuery(false); // Only show non-diff types for regular files
} 
