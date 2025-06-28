import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { Revision } from '../types/revision';
import type { Subproject } from '../types/subpoject';
import type { Project } from '../types/project';
import { revisionService, subprojectService, projectService } from '../api/Services';

const RevisionsPage = () => {
  const { subprojectId } = useParams<{ subprojectId?: string }>();
  const navigate = useNavigate();
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    revisionService.getItems().then(setRevisions);
    subprojectService.getItems().then(setSubprojects);
    projectService.getItems().then(setProjects);
  }, []);

  const handleRevisionClick = (revision: Revision) => {
    console.log('Revision clicked:', revision.id);
    
    // Get the subproject and project information
    const subproject = subprojects.find(s => s.id === revision.subprojectId);
    if (!subproject) {
      console.error('Subproject not found for revision:', revision.id);
      return;
    }
    
    const project = projects.find(p => p.id === subproject.projectId);
    if (!project) {
      console.error('Project not found for subproject:', subproject.id);
      return;
    }
    
    // Navigate to Files page with the selected parameters
    const filesUrl = `/files?projectId=${project.id}&subprojectId=${subproject.id}&revisionId=${revision.id}`;
    navigate(filesUrl);
  };

  const handleCreateRevision = async (formData: Record<string, string>) => {
    console.log('Creating revision with data:', formData);
    try {
      const newRevision = await revisionService.createItem({
        revisionNumber: parseInt(formData.revisionNumber),
        projectId: parseInt(formData.projectId),
        subprojectId: subprojectId || '',
        title: formData.title,
        description: formData.description
      });
      console.log('Revision created:', newRevision);
      // Refresh the revisions list
      const updatedRevisions = await revisionService.getItems();
      setRevisions(updatedRevisions);
    } catch (error) {
      console.error('Error creating revision:', error);
    }
  };

  // Filter revisions by subproject if subprojectId is provided
  const filterRevisionsBySubproject = (revisions: Revision[], params: Record<string, unknown>) => {
    const subprojectId = params.subprojectId as string;
    if (!subprojectId) return revisions;
    
    // Filter by actual subprojectId relationship
    return revisions.filter(revision => revision.subprojectId === subprojectId);
  };

  // Determine title and breadcrumbs based on context
  const title = subprojectId ? `Ревизии подпроекта "${subprojectService.getItem(subprojectId).then(subproject => subproject.title)}"` : 'Ревизии';
  
  return (
    <>
      <Navigation />
      <DataGrid<Revision>
        title={title}
        items={revisions}
        renderCard={(revision) => (
          <DataCard 
            item={revision} 
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
        filterFunction={subprojectId ? filterRevisionsBySubproject : undefined}
        filterParams={subprojectId ? { subprojectId } : {}}
      />
    </>
  );
};

export default RevisionsPage; 