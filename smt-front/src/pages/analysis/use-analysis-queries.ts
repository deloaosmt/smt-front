// Re-export shared queries for analysis page
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

// Analysis page specific document types query (diff types only)
import { useDocumentTypesQuery as useBaseDocumentTypesQuery } from '../../api/queries';

export function useDocumentTypesQuery() {
  return useBaseDocumentTypesQuery(true); // Only show diff types
}

// Analysis-specific files query that filters for diff document types
import { useQuery } from '@tanstack/react-query';
import { fileService } from '../../api/Services';
import { FileListType, type FileFilterParams } from '../../types/file';

export function useAnalysisFilesQuery(filters: FileFilterParams = {
  document_type: null,
  project_id: null,
  subproject_id: null,
  revision_id: null,
  filter: FileListType.Diff
}) {
  const { data: diffTypes = [] } = useDocumentTypesQuery();
  
  return useQuery({
    queryKey: ['analysis-files', filters, diffTypes.map(t => t.type)],
         queryFn: async () => {
       // Get all files and filter client-side for diff types
       const allFiles = await fileService.getFiles(filters);
       const diffTypeNames = diffTypes.map(dt => dt.type);
       return allFiles.filter(file => file.document_type && diffTypeNames.includes(file.document_type));
     },
    enabled: diffTypes.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
} 