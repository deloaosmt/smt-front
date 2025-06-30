import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { Project } from '../types/project';
import { projectService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';
import Button from '@mui/joy/Button';

const ProjectsPage = () => {
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    console.log('Project clicked:', project.id);
    // Navigate to project-specific subprojects page
    navigate(`/projects/${project.id}/subprojects`);
  };

  const handleCreateProject = async (formData: Record<string, string>) => {
    console.log('Creating project with data:', formData);
    try {
      const newProject = await projectService.createProject({
        title: formData.title,
        description: formData.description || null
      });
      console.log('Project created:', newProject);
      // Refresh the projects list
      const updatedProjects = await projectService.getProjects();
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    projectService.getProjects().then(setProjects).then(() => setIsLoading(false));
  }, []);

  const handleDeleteProject = async (project: Project) => {
    console.log('Deleting project:', project.id);
    try {
      await projectService.deleteProject(project.id);
      const updatedProjects = await projectService.getProjects();
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <>
      <Navigation />
      {isLoading && <CircularLoader />}
      {!isLoading &&
        <DataGrid<Project>
          title="Проекты"
          items={projects}
          renderCard={(project) => (
            <DataCard title={project.title} >
              <Button variant="outlined" color="danger" size="sm" onClick={() => handleDeleteProject(project)}>
                Удалить 
              </Button>
              <Button variant="outlined" color="neutral" size="sm" onClick={() => handleProjectClick(project)}>
                Открыть
              </Button>
            </DataCard>
          )}
          onCreateItem={handleCreateProject}
          createModalTitle="Создать проект"
          createModalDescription="Заполните информацию о проекте."
          createButtonText="Создать проект"
          formFields={[
            { name: 'title', label: 'Название проекта', required: true },
            { name: 'description', label: 'Описание проекта', required: false }
          ]}
          emptyStateTitle="Нет проектов"
          emptyStateDescription="Создайте свой первый проект для начала"
        />
      }
    </>
  );
};

export default ProjectsPage; 