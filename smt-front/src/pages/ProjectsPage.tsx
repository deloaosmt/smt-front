import React from 'react';
import { useNavigate } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import { mockProjects } from '../data/mockProjects';
import type { Project } from '../types/project';

const ProjectsPage = () => {
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    console.log('Project clicked:', project.id);
    // Navigate to project-specific subprojects page
    navigate(`/projects/${project.id}/subprojects`);
  };

  const handleCreateProject = (formData: Record<string, string>) => {
    console.log('Creating project with data:', formData);
    // You can add API call to create project here
  };

  return (
    <>
      <Navigation />
      <DataGrid<Project>
        title="Проекты"
        items={mockProjects}
        renderCard={(project) => (
          <DataCard 
            item={project} 
            onClick={() => handleProjectClick(project)}
            onForwardClick={() => handleProjectClick(project)}
          />
        )}
        onCreateItem={handleCreateProject}
        createModalTitle="Создать проект"
        createModalDescription="Заполните информацию о проекте."
        createButtonText="Создать проект"
        formFields={[
          { name: 'title', label: 'Название проекта', required: true },
          { name: 'description', label: 'Описание проекта', required: true }
        ]}
        emptyStateTitle="Нет проектов"
        emptyStateDescription="Создайте свой первый проект для начала"
      />
    </>
  );
};

export default ProjectsPage; 