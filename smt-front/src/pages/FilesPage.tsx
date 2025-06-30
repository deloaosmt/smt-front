import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { File } from '../types/file';
import { fileService, projectService, subprojectService, revisionService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';

const FilesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const [projectId, subprojectId] = searchFields;

  // Effect to load initial data (all files and projects)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [filesData, projectsData] = await Promise.all([
          fileService.getFiles(),
          projectService.getProjects()
        ]);
        setFiles(filesData);
        setSearchOptions(prev => [
          { ...prev[0], values: projectsData.map(p => p.id.toString()) },
          { ...prev[1], values: [] },
          { ...prev[2], values: [] }
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Effect for loading subprojects when projectId changes.
  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      subprojectService.getSubprojects(parseInt(projectId))
        .then(projectSubprojects => {
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

  const handleCreateFile = async (formData: Record<string, string>) => {
    console.log('Creating file with data:', formData);
    try {
      const updatedFiles = await fileService.getFiles();
      setFiles(updatedFiles);
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleSearchChange = (newSearchFields: Array<string | null>) => {
    const [newProjectId, newSubprojectId] = newSearchFields;
    const [oldProjectId] = searchFields;

    let fieldsToUpdate = [...newSearchFields];

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

  return (
    <>
      <Navigation />
      {isLoading && <CircularLoader />}
      {!isLoading &&
        <DataGrid<File>
          title="Файлы"
          items={files}
          renderCard={(file) => (
            <DataCard
              title={file.name}
            />
          )}
          onCreateItem={handleCreateFile}
          createModalTitle="Создать файл"
          createModalDescription="Заполните информацию о файле."
          createButtonText="Создать файл"
          formFields={[
            { name: 'displayName', label: 'Название файла', required: true },
            { name: 'documentType', label: 'Тип документа', required: true },
            { name: 'projectId', label: 'ID проекта', required: false },
            { name: 'subprojectId', label: 'ID подпроекта', required: false },
            { name: 'revisionId', label: 'ID ревизии', required: false }
          ]}
          emptyStateTitle="Нет файлов"
          emptyStateDescription="Создайте свой первый файл для начала"
          searchConfig={{
            searchOptions: searchOptions,
            onChange: handleSearchChange,
            searchValues: searchFields
          }}
        />
      }
    </>
  );
};

export default FilesPage; 