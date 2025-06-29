import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { File } from '../types/file';
import { fileService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';

const FilesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialSearchFields, setInitialSearchFields] = useState<Array<string | null>>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fileService.getItems().then(setFiles).then(() => setIsLoading(false));
  }, []);

  const handleFileClick = (file: File) => {
    console.log('File clicked:', file.id);
    // You can add navigation to file details here
  };

  const handleCreateFile = async (formData: Record<string, string>) => {
    console.log('Creating file with data:', formData);
    try {
      const newFile = await fileService.createItem({
        name: formData.displayName,
        document_type: formData.documentType || 'document',
        revision_id: formData.revisionId ? parseInt(formData.revisionId) : null,
        project_id: formData.projectId ? parseInt(formData.projectId) : null,
        subproject_id: formData.subprojectId ? parseInt(formData.subprojectId) : null
      });
      console.log('File created:', newFile);
      // Refresh the files list
      const updatedFiles = await fileService.getItems();
      setFiles(updatedFiles);
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  // Handle URL parameters and set initial search fields
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    const subprojectId = searchParams.get('subprojectId');
    const revisionId = searchParams.get('revisionId');
    
    if (projectId || subprojectId || revisionId) {
      const newSearchFields = [
        projectId,
        subprojectId,
        revisionId
      ];
      setInitialSearchFields(newSearchFields);
    }
  }, [searchParams]);

  // Create search options for filtering
  const searchOptions = [
    { 
      label: 'Проект', 
      values: ['1', '2', '3', '4', '5', '6', '7'] 
    },
    { 
      label: 'Подпроект', 
      values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'] 
    },
    { 
      label: 'Ревизия', 
      values: ['1', '2'] 
    }
  ];

  const handleSearchChange = (searchFields: Array<string | null>) => {
    console.log('Search fields changed:', searchFields);
    
    // Update URL parameters based on search fields
    const newSearchParams = new URLSearchParams();
    if (searchFields[0]) newSearchParams.set('projectId', searchFields[0]);
    if (searchFields[1]) newSearchParams.set('subprojectId', searchFields[1]);
    if (searchFields[2]) newSearchParams.set('revisionId', searchFields[2]);
    
    setSearchParams(newSearchParams);
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
              item={file} 
              onClick={() => handleFileClick(file)}
              showChip={true}
              chipColor="primary"
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
            initialValues: initialSearchFields
          }}
        />
      }
    </>
  );
};

export default FilesPage; 