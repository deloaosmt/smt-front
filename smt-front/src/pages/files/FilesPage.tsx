import FileTable from '../../components/FileTable';
import { CircularLoader } from '../../components/CircularLoader';
import { NextPrevPagination } from '../../components/Pagination';
import { useFilesState } from './use-files-state';
import { CreateFileModal } from './CreateFileModal';
import { DeleteFileModal } from './DeleteFileModal';
import SinglePage from '../../components/SinglePage';

const FilesPage = () => {
  
  const {
    // State
    files,
    isLoading,
    projects,
    subprojects,
    revisions,
    documentTypes,
    filterState,

    // Pagination state
    currentPage,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,

    // Actions
    setCreateModalOpen,
    setDeleteModalOpen,

    // Pagination actions
    handleNextPage,
    handlePrevPage,

    // Handlers
    downloadFile,
    handleSearchChange
  } = useFilesState();

  return (
    <SinglePage>
      {isLoading && <CircularLoader />}
      {!isLoading && (
        <>
          <FileTable
            files={files}
            isLoading={isLoading}
            onDownload={downloadFile}
            onDelete={(file) => setDeleteModalOpen(file)}
            onCreate={() => setCreateModalOpen(true)}
            fileTypes={documentTypes}
            projects={projects}
            subprojects={subprojects}
            revisions={revisions}
            filters={filterState}
            onFiltersChange={handleSearchChange}
          />
          <NextPrevPagination
            currentPage={currentPage}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            itemsPerPage={itemsPerPage}
            currentItemsCount={files.length}
          />
        </>
      )}
      <CreateFileModal />
      <DeleteFileModal />
    </SinglePage>
  );
};

export default FilesPage; 