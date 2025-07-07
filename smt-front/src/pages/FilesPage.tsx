import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { File } from '../types/file';
import type { Project } from '../types/project';
import type { Subproject } from '../types/subpoject';
import type { Revision } from '../types/revision';
import { fileService, projectService, subprojectService, revisionService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';
import { Modal, ModalDialog, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Button, Option, Chip } from '@mui/joy';

const FilesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<File | null>(null);

  // Store actual objects for selection in the create modal
  const [projects, setProjects] = useState<Project[]>([]);
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);

  // The single source of truth for the selected search values.
  // Initialized from the URL search params.
  const [searchFields, setSearchFields] = useState<Array<string | null>>(() => {
    const projectId = searchParams.get('projectId');
    const subprojectId = searchParams.get('subprojectId');
    const revisionId = searchParams.get('revisionId');
    return [projectId, subprojectId, revisionId];
  });


  // State for the dropdown options.
  const [searchOptions, setSearchOptions] = useState<Array<{ label: string, values: string[] }>>([
    { label: 'Проект', values: [] },
    { label: 'Подпроект', values: [] },
    { label: 'Ревизия', values: [] }
  ]);

  const [projectId, subprojectId, revisionId] = searchFields;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [filesData, projectsData, documentTypesData] = await Promise.all([
        fileService.getFiles(),
        projectService.getProjects(),
        fileService.getDocumentTypes()
      ]);
      setFiles(filesData);
      setProjects(projectsData);
      setSearchOptions(prev => [
        { ...prev[0], values: projectsData.map(p => p.id.toString()) },
        { ...prev[1], values: [] },
        { ...prev[2], values: [] }
      ]);
      setDocumentTypes(documentTypesData.map(type => type.type));
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

  // Effect for loading subprojects when projectId changes.
  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      subprojectService.getSubprojects(parseInt(projectId))
        .then(projectSubprojects => {
          setSubprojects(projectSubprojects);
          setSearchOptions(prev => [
            prev[0],
            { ...prev[1], values: projectSubprojects.map(sp => sp.id.toString()) },
            { ...prev[2], values: [] } // Reset revisions
          ]);
        })
        .catch(error => console.error('Error loading subprojects:', error))
        .finally(() => setIsLoading(false));
    } else {
      // If no project, clear subprojects and revisions
      setSubprojects([]);
      setSearchOptions(prev => [
        prev[0],
        { ...prev[1], values: [] },
        { ...prev[2], values: [] }
      ]);
    }
  }, [projectId]);

  // Effect for loading revisions when subprojectId changes.
  useEffect(() => {
    if (subprojectId) {
      setIsLoading(true);
      revisionService.getRevisions(parseInt(subprojectId))
        .then(subprojectRevisions => {
          setRevisions(subprojectRevisions);
          setSearchOptions(prev => [
            prev[0],
            prev[1],
            { ...prev[2], values: subprojectRevisions.map(r => r.id.toString()) }
          ]);
        })
        .catch(error => console.error('Error loading revisions:', error))
        .finally(() => setIsLoading(false));
    } else {
      // If no subproject, clear revisions
      setRevisions([]);
      setSearchOptions(prev => [
        prev[0],
        prev[1],
        { ...prev[2], values: [] }
      ]);
    }
  }, [subprojectId]);

  // Effect to sync searchFields state to URL search params.
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (searchFields[0]) newSearchParams.set('projectId', searchFields[0]);
    if (searchFields[1]) newSearchParams.set('subprojectId', searchFields[1]);
    if (searchFields[2]) newSearchParams.set('revisionId', searchFields[2]);

    // Use replace to avoid polluting browser history
    setSearchParams(newSearchParams, { replace: true });
  }, [searchFields, setSearchParams]);

  const handleCreateFile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const name = formData.get('name') as string;
    const selectedProjectId = formData.get('projectId') as string;
    const selectedSubprojectId = formData.get('subprojectId') as string;
    const selectedRevisionId = formData.get('revisionId') as string;
    const selectedDocumentType = formData.get('documentType') as string;

    // Use the selectedFile state instead of accessing the ref
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    try {
      await fileService.uploadFile(
        {
          name,
          document_type: selectedDocumentType,
          project_id: parseInt(selectedProjectId),
          subproject_id: parseInt(selectedSubprojectId),
          revision_id: parseInt(selectedRevisionId)
        },
        selectedFile
      );

      setSelectedFile(null);
      setCreateModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleDeleteFile = async (file: File) => {
    try {
      await fileService.deleteFile(file.id);
      setDeleteModalOpen(null);
      await loadData();
    } catch (error) {
      console.error('Error deleting file:', error);
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
    setSelectedFile(null);
    setCreateModalOpen(false);
  };

  const createModal = (
    <Modal open={createModalOpen} onClose={handleCloseCreateModal}>
      <ModalDialog>
        <DialogTitle>Создать документ</DialogTitle>
        <DialogContent>Заполните информацию о документе.</DialogContent>

        <form onSubmit={handleCreateFile}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Название документа</FormLabel>
              <Input required name="name" />
            </FormControl>

            <FormControl>
              <FormLabel>Проект</FormLabel>
              <Select
                name="projectId"
                required
                placeholder="Выберите проект"
                defaultValue={projectId || undefined}
                onChange={(_, value) => {
                  if (value) {
                    subprojectService.getSubprojects(parseInt(value.toString()))
                      .then(setSubprojects)
                      .catch(error => console.error('Error loading subprojects:', error));
                  } else {
                    setSubprojects([]);
                  }
                  setRevisions([]);
                }}
              >
                {projects.map(project => (
                  <Option key={project.id} value={project.id.toString()}>
                    {project.title}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Подпроект</FormLabel>
              <Select
                name="subprojectId"
                required
                placeholder="Выберите подпроект"
                defaultValue={subprojectId || undefined}
                onChange={(_, value) => {
                  if (value) {
                    revisionService.getRevisions(parseInt(value.toString()))
                      .then(setRevisions)
                      .catch(error => console.error('Error loading revisions:', error));
                  } else {
                    setRevisions([]);
                  }
                }}
              >
                {subprojects.map(subproject => (
                  <Option key={subproject.id} value={subproject.id.toString()}>
                    {subproject.title}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Ревизия</FormLabel>
              <Select
                name="revisionId"
                required
                placeholder="Выберите ревизию"
                defaultValue={revisionId || undefined}
              >
                {revisions.map(revision => (
                  <Option key={revision.id} value={revision.id.toString()}>
                    {revision.title}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Тип документа</FormLabel>
              <Select name="documentType" required placeholder="Выберите тип документа">
                {documentTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Файл</FormLabel>
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color={selectedFile ? 'success' : 'neutral'}
              >
                {selectedFile ? selectedFile.name : 'Выбрать файл'}
                <input
                  ref={fileInputRef}
                  style={{
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: 1,
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    whiteSpace: 'nowrap',
                    width: 1,
                  }}
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </Button>
            </FormControl>
            <Button type="submit" disabled={!selectedFile}>Создать документ</Button>
          </Stack>
        </form>

      </ModalDialog>
    </Modal>
  );

  const downloadFile = async (file: File) => {
    try {
      const downloadUrl = await fileService.getDownloadUrl(file.id);
      window.open(downloadUrl.download_url, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <>
      <Navigation />
      {isLoading && <CircularLoader />}
      {!isLoading &&
        <DataGrid<File>
          title="Файлы"
          items={files}
          renderCard={(file) => (
            <DataCard title={file.name} chip={file.document_type}>
              <Button variant="outlined" color="danger" size="sm" onClick={() => setDeleteModalOpen(file)}>
                Удалить
              </Button>
              <Button variant="outlined" color="neutral" size="sm" onClick={() => downloadFile(file)}>
                Скачать
              </Button>
            </DataCard>
          )}
          onCreateItem={() => setCreateModalOpen(true)}
          emptyStateTitle="Нет файлов"
          emptyStateDescription="Создайте свой первый файл для начала"
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

export default FilesPage; 