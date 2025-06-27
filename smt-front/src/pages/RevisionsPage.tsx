import React from 'react';
import { useParams } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import { mockRevisions } from '../data/mockRevisions';
import { mockSubprojects } from '../data/mockSubprojects';
import { mockProjects } from '../data/mockProjects';
import type { Revision } from '../types/revision';

const RevisionsPage = () => {
  const { subprojectId } = useParams<{ subprojectId?: string }>();

  const handleRevisionClick = (revision: Revision) => {
    console.log('Revision clicked:', revision.id);
    // You can add navigation to revision details here
  };

  const handleCreateRevision = (formData: Record<string, string>) => {
    console.log('Creating revision with data:', formData);
    // You can add API call to create revision here
  };

  // Filter revisions by subproject if subprojectId is provided
  const filterRevisionsBySubproject = (revisions: Revision[], params: Record<string, unknown>) => {
    const subprojectId = params.subprojectId as string;
    if (!subprojectId) return revisions;
    
    // Filter by actual subprojectId relationship
    return revisions.filter(revision => revision.subprojectId === subprojectId);
  };

  // Get subproject and project information for breadcrumbs
  const getSubprojectInfo = () => {
    if (!subprojectId) return { subproject: null, project: null };
    const subproject = mockSubprojects.find(s => s.id === subprojectId);
    if (!subproject) return { subproject: null, project: null };
    
    const project = mockProjects.find(p => p.id === subproject.projectId);
    return { subproject, project };
  };

  // Determine title and breadcrumbs based on context
  const { subproject, project } = getSubprojectInfo();
  const title = subprojectId ? `Ревизии подпроекта "${subproject?.title || 'Unknown'}"` : 'Ревизии';
  
  const breadcrumbs = subprojectId && subproject && project ? [
    { label: 'Проекты', path: '/projects' },
    { label: project.title, path: `/projects/${project.id}/subprojects` },
    { label: subproject.title, path: `/subprojects/${subproject.id}` },
    { label: 'Ревизии' }
  ] : [];

  return (
    <>
      <Navigation />
      <DataGrid<Revision>
        title={title}
        items={mockRevisions}
        renderCard={(revision) => (
          <DataCard 
            item={revision} 
            onClick={() => handleRevisionClick(revision)} 
            onForwardClick={() => handleRevisionClick(revision)}
            showChip={true}
            chipColor="success"
          />
        )}
        onCreateItem={handleCreateRevision}
        createModalTitle="Создать ревизию"
        createModalDescription="Заполните информацию о ревизии."
        createButtonText="Создать ревизию"
        formFields={[
          { name: 'title', label: 'Название ревизии', required: true },
          { name: 'description', label: 'Описание ревизии', required: true },
          { name: 'revisionNumber', label: 'Номер ревизии', required: true },
          { name: 'projectId', label: 'ID проекта', required: true }
        ]}
        emptyStateTitle="Нет ревизий"
        emptyStateDescription={subprojectId 
          ? "В этом подпроекте пока нет ревизий" 
          : "Создайте свою первую ревизию для начала"
        }
        breadcrumbs={breadcrumbs}
        filterFunction={subprojectId ? filterRevisionsBySubproject : undefined}
        filterParams={subprojectId ? { subprojectId } : {}}
      />
    </>
  );
};

export default RevisionsPage; 