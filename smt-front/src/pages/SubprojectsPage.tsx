import React from 'react';
import { useNavigate, useParams } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import { mockSubprojects } from '../data/mockSubprojects';
import { mockProjects } from '../data/mockProjects';
import type { Subproject } from '../types/subpoject';

const SubprojectsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();

  const handleSubprojectClick = (subproject: Subproject) => {
    console.log('Subproject clicked:', subproject.id);
    // Navigate to subproject-specific revisions page
    navigate(`/subprojects/${subproject.id}/revisions`);
  };

  const handleCreateSubproject = (formData: Record<string, string>) => {
    console.log('Creating subproject with data:', formData);
    // You can add API call to create subproject here
  };

  // Filter subprojects by project if projectId is provided
  const filterSubprojectsByProject = (subprojects: Subproject[], params: Record<string, unknown>) => {
    const projectId = params.projectId as string;
    if (!projectId) return subprojects;
    
    // Filter by actual projectId relationship
    return subprojects.filter(subproject => subproject.projectId === projectId);
  };

  // Get project title for breadcrumbs
  const getProjectTitle = () => {
    if (!projectId) return '';
    const project = mockProjects.find(p => p.id === projectId);
    return project?.title || `Project ${projectId}`;
  };

  // Determine title and breadcrumbs based on context
  const title = projectId ? `Подпроекты проекта "${getProjectTitle()}"` : 'Подпроекты';
  const breadcrumbs = projectId ? [
    { label: 'Проекты', path: '/projects' },
    { label: getProjectTitle() },
    { label: 'Подпроекты' }
  ] : [];

  return (
    <>
      <Navigation />
      <DataGrid<Subproject>
        title={title}
        items={mockSubprojects}
        renderCard={(subproject) => (
          <DataCard 
            item={subproject} 
            onForwardClick={() => handleSubprojectClick(subproject)}
          />
        )}
        onCreateItem={handleCreateSubproject}
        createModalTitle="Создать подпроект"
        createModalDescription="Заполните информацию о подпроекте."
        createButtonText="Создать подпроект"
        formFields={[
          { name: 'title', label: 'Название подпроекта', required: true },
          { name: 'description', label: 'Описание подпроекта', required: true }
        ]}
        emptyStateTitle="Нет подпроектов"
        emptyStateDescription={projectId 
          ? "В этом проекте пока нет подпроектов" 
          : "Создайте свой первый подпроект для начала"
        }
        breadcrumbs={breadcrumbs}
        filterFunction={projectId ? filterSubprojectsByProject : undefined}
        filterParams={projectId ? { projectId } : {}}
      />
    </>
  );
};

export default SubprojectsPage; 