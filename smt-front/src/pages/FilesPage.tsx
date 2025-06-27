import React from 'react';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import { mockFiles } from '../data/mockFiles';
import type { File } from '../types/file';

const FilesPage = () => {
  const handleFileClick = (file: File) => {
    console.log('File clicked:', file.id);
    // You can add navigation to file details here
  };

  const handleCreateFile = (formData: Record<string, string>) => {
    console.log('Creating file with data:', formData);
    // You can add API call to create file here
  };

  return (
    <>
      <Navigation />
      <DataGrid<File>
        title="Файлы"
        items={mockFiles}
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
          { name: 'description', label: 'Описание файла', required: true }
        ]}
        emptyStateTitle="Нет файлов"
        emptyStateDescription="Создайте свой первый файл для начала"
      />
    </>
  );
};

export default FilesPage; 