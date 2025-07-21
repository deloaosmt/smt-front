import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { File } from '../types/file';

import { fileService, projectService, diffService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';
import { Modal, ModalDialog, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Button, Option, Typography } from '@mui/joy';
import { truncate } from '../common/TextUtils';
import useNotification from '../notifications/hook';
import { getErrorMessage } from '../common/OnError';

const AnalysisPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { notifySuccess, notifyError } = useNotification();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<File | null>(null);

  // Analysis modal states
  const [selectedFiles, setSelectedFiles] = useState<{ diffname: string | null, left: string | null, right: string | null }>({ diffname: null, left: null, right: null });
  const [isCreatingDiff, setIsCreatingDiff] = useState(false);

  // The single source of truth for the selected search values.
  // Initialized from the URL search params.
  const [searchFields, setSearchFields] = useState<Array<string | null>>(() => {
    const projectId = searchParams.get('projectId');
    const subprojectId = searchParams.get('subprojectId');
    const revisionId = searchParams.get('revisionId');
    return [projectId, subprojectId, revisionId];
  });

  const [searchOptions, setSearchOptions] = useState<Array<{ label: string, values: Array<{ id: string, title: string }> }>>([
    { label: 'Проект', values: [] },
    { label: 'Подпроект', values: [] },
    { label: 'Изм', values: [] }
  ]);

  const [subprojectId] = searchFields;

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [filesData, projectsData] = await Promise.all([
        fileService.getFiles(),
        projectService.getProjects()
      ]);
      setFiles(filesData);
      setSearchOptions(prev => [
        { ...prev[0], values: projectsData.map(p => ({ id: p.id.toString(), title: p.title })) },
        { ...prev[1], values: [] },
        { ...prev[2], values: [] }
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const filesData = await fileService.getFiles();
      setFiles(filesData);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to load initial data (all files and projects)
  useEffect(() => {
    loadInitialData();
  }, []);





  // Effect to sync searchFields state to URL search params.
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (searchFields[0]) newSearchParams.set('projectId', searchFields[0]);
    if (searchFields[1]) newSearchParams.set('subprojectId', searchFields[1]);
    if (searchFields[2]) newSearchParams.set('revisionId', searchFields[2]);

    // Use replace to avoid polluting browser history
    setSearchParams(newSearchParams, { replace: true });
  }, [searchFields, setSearchParams]);



  const handleCreateDiff = async () => {
    if (!selectedFiles.left || !selectedFiles.right) {
      console.error('Both files must be selected');
      notifyError('Необходимо выбрать оба файла для сравнения');
      return;
    }

    setIsCreatingDiff(true);
    try {
      const result = await diffService.createDiff({
        name: selectedFiles.diffname || `Diff ${new Date().toISOString()}`,
        doc_id_left: parseInt(selectedFiles.left),
        doc_id_right: parseInt(selectedFiles.right)
      });

      console.log('Diff created:', result);
      setCreateModalOpen(false);
      notifySuccess('Дифф-файл успешно создан');
      await loadData();
    } catch (error) {
      console.error('Error creating diff:', error);
      notifyError(getErrorMessage(error));
    } finally {
      setIsCreatingDiff(false);
    }
  };

  const handleDeleteFile = async (file: File) => {
    try {
      await fileService.deleteFile(file.id);
      setDeleteModalOpen(null);
      await loadData();
      notifySuccess('Файл успешно удален!');
    } catch (error) {
      console.error('Error deleting file:', error);
      notifyError(getErrorMessage(error));
    }
  };

  const handleSearchChange = (newSearchFields: Array<string | null>) => {
    const [newProjectId, newSubprojectId] = newSearchFields;
    const [oldProjectId] = searchFields;

    const fieldsToUpdate = [...newSearchFields];

    // If project has changed, we must reset subproject and revision.
    if (newProjectId !== oldProjectId) {
      fieldsToUpdate[1] = null;
      fieldsToUpdate[2] = null;
    }
    // If subproject has changed, we must reset revision.
    else if (newSubprojectId !== subprojectId) {
      fieldsToUpdate[2] = null;
    }

    setSearchFields(fieldsToUpdate);
  };

  const deleteModal = (
    <Modal open={deleteModalOpen !== null} onClose={() => setDeleteModalOpen(null)}>
      <ModalDialog>
        <DialogTitle>Удалить документ</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p>Вы уверены, что хотите удалить документ {deleteModalOpen?.name}?</p>
          <Stack direction="row" spacing={2} justifyContent="space-around">
            <Button variant="outlined" color="danger" onClick={() => handleDeleteFile(deleteModalOpen!)}>
              Удалить
            </Button>
            <Button variant="outlined" color="neutral" onClick={() => setDeleteModalOpen(null)}>
              Отмена
            </Button>
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );

  const handleCloseCreateModal = () => {
    setSelectedFiles({ diffname: null, left: null, right: null });
    setCreateModalOpen(false);
  };

  const createModal = (
    <Modal open={createModalOpen} onClose={() => !isCreatingDiff && handleCloseCreateModal()}>
      <ModalDialog size="lg">
        <DialogTitle>Создать анализ</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <p>Выберите два файла для анализа.</p>

            <FormControl>
              <FormLabel>Название дифф-файла</FormLabel>
              <Input onChange={(e) => setSelectedFiles(prev => ({ ...prev, diffname: e.target.value }))} />
            </FormControl>

            <FormControl>
              <FormLabel>Первый файл</FormLabel>
              <Select
                value={selectedFiles.left}
                onChange={(_, value) => setSelectedFiles(prev => ({ ...prev, left: value }))}
                placeholder="Выберите первый файл"
              >
                {files.map(file => (
                  <Option key={`left-${file.id}`} value={file.id.toString()}>{file.name}</Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Второй файл</FormLabel>
              <Select
                value={selectedFiles.right}
                onChange={(_, value) => setSelectedFiles(prev => ({ ...prev, right: value }))}
                placeholder="Выберите второй файл"
              >
                {files.map(file => (
                  <Option key={`right-${file.id}`} value={file.id.toString()}>{file.name}</Option>
                ))}
              </Select>
            </FormControl>

            <Button
              onClick={handleCreateDiff}
              disabled={!selectedFiles.left || !selectedFiles.right || !selectedFiles.diffname || isCreatingDiff}
            >
              {isCreatingDiff ? <CircularLoader size="sm" /> : 'Создать анализ'}
            </Button>
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );

  const downloadFile = async (file: File) => {
    try {
      const downloadUrl = await fileService.getDownloadUrl(file.id);
      window.open(downloadUrl.download_url, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      notifyError(getErrorMessage(error));
    }
  };

  return (
    <>
      <Navigation />
      {isLoading && <CircularLoader />}
      {!isLoading &&
        <DataGrid<File>
          title="Анализ"
          items={files}
          renderCard={(file) => (
            <DataCard title={file.name} chip={file.document_type || undefined} chips={
              <Stack direction="column" spacing={1} justifyContent="space-between" alignItems="center">
                <Typography level="body-sm" sx={{ alignSelf: 'flex-start' }}>{truncate(file.filename || "Без названия", 50)}</Typography>
                <Typography level="body-sm" sx={{ alignSelf: 'flex-start' }}>Рев: {truncate(file.revision_name || "Без названия", 50)}</Typography>
              </Stack>
            }>
              <Button variant="outlined" color="danger" size="sm" onClick={() => setDeleteModalOpen(file)}>
                Удалить
              </Button>
              <Button variant="outlined" color="neutral" size="sm" onClick={() => downloadFile(file)}>
                Скачать
              </Button>
            </DataCard>
          )}
          onCreateItem={async () => {
            try {
              // Get all files for analysis
              const allFiles = await fileService.getFiles();
              setFiles(allFiles);
              setCreateModalOpen(true);
            } catch (error) {
              console.error('Error loading files:', error);
              notifyError(getErrorMessage(error));
            }
          }}
          emptyStateTitle="Нет файлов анализа"
          emptyStateDescription="Создайте свой первый анализ для начала"
          searchConfig={{
            searchOptions: searchOptions,
            onChange: handleSearchChange,
            searchValues: searchFields
          }}
        />
      }
      {createModal}
      {deleteModal}
    </>
  );
};

export default AnalysisPage; 