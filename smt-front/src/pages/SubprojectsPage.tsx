import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { Subproject } from '../types/subpoject';
import type { Project } from '../types/project';
import { projectService, subprojectService } from '../api/Services';

const SubprojectsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    subprojectService.getItems().then(
      (subprojects) => {
        setSubprojects(subprojects.filter(subproject => subproject.projectId === projectId || !projectId));
      }
    );
    projectService.getItems().then(setProjects);
  }, [projectId]);

  const handleSubprojectClick = (subproject: Subproject) => {
    console.log('Subproject clicked:', subproject.id);
    // Navigate to subproject-specific revisions page
    navigate(`/subprojects/${subproject.id}/revisions`);
  };

  const handleCreateSubproject = async (formData: Record<string, string>) => {
    console.log('Creating subproject with data:', formData);
    try {
      const newSubproject = await subprojectService.createItem({
        title: formData.title,
        description: formData.description,
        projectId: projectId || ''
      });
      console.log('Subproject created:', newSubproject);
      // Refresh the subprojects list
      const updatedSubprojects = await subprojectService.getItems();
      setSubprojects(updatedSubprojects.filter(subproject => subproject.projectId === projectId || !projectId));
    } catch (error) {
      console.error('Error creating subproject:', error);
    }
  };

  // Filter subprojects by project if projectId is provided
  const filterSubprojectsByProject = (subprojects: Subproject[], params: Record<string, unknown>) => {
    const projectId = params.projectId as string;
    if (!projectId) return subprojects;

    // Filter by actual projectId relationship
    return subprojects.filter(subproject => subproject.projectId === projectId);
  };

  // Get project title for the page title
  const getProjectTitle = () => {
    if (!projectId) return '';
    const project = projects.find(p => p.id === projectId);
    return project?.title || '';
  };

  return (
    <>
      <Navigation />
      <DataGrid<Subproject>
        title={projectId ? `Подпроекты проекта "${getProjectTitle()}"` : 'Подпроекты'}
        items={subprojects}
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
        filterFunction={projectId ? filterSubprojectsByProject : undefined}
        filterParams={projectId ? { projectId } : {}}
      />
    </>
  );
};

export default SubprojectsPage; 