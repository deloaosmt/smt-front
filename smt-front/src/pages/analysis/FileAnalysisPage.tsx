import FileTable from '../../components/FileTable';
import { CircularLoader } from '../../components/CircularLoader';
import { useAnalysisState } from './use-analysis-state';
import { CreateDiffModal } from './CreateDiffModal';
import { DeleteFileModal } from '../files/DeleteFileModal';
import SinglePage from '../../components/SinglePage';

export function FileAnalysisPage() {
  const {
    // State
    files,
    isLoading,
    projects,
    subprojects,
    revisions,
    documentTypes,
    filterState,

    // Actions
    setCreateDiffModalOpen,
    setDeleteModalOpen,

    // Handlers
    downloadFile,
    handleSearchChange
  } = useAnalysisState();

  return (
    <SinglePage>
      {isLoading && <CircularLoader />}
      {!isLoading && (
        <FileTable
          files={files}
          isLoading={isLoading}
          onDownload={downloadFile}
          onDelete={(file) => setDeleteModalOpen(file)}
          onCreate={() => setCreateDiffModalOpen(true)}
          fileTypes={documentTypes}
          projects={projects}
          subprojects={subprojects}
          revisions={revisions}
          filters={filterState}
          onFiltersChange={handleSearchChange}
        />
      )}
      <CreateDiffModal />
      <DeleteFileModal />
    </SinglePage>
  );
}

export default FileAnalysisPage; 
