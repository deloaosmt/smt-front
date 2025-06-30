import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { Subproject } from '../types/subpoject';
import type { Project } from '../types/project';
import { projectService, subprojectService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';
import { Button } from '@mui/joy';

const SubprojectsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (projectId) {
          // Load subprojects for specific project
          const projectSubprojects = await subprojectService.getSubprojects(parseInt(projectId));
          setSubprojects(projectSubprojects);

          // Load project info
          const project = await projectService.getProject(parseInt(projectId));
          setProjects([project]);
        } else {
          // Load all projects first, then get subprojects for each
          const allProjects = await projectService.getProjects();
          setProjects(allProjects);
          
          const allSubprojects: Subproject[] = [];
          for (const project of allProjects) {
            const projectSubprojects = await subprojectService.getSubprojects(project.id);
            allSubprojects.push(...projectSubprojects);
          }
          setSubprojects(allSubprojects);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleSubprojectClick = (subproject: Subproject) => {
    console.log('Subproject clicked:', subproject.id);
    // Navigate to subproject-specific revisions page
    navigate(`/subprojects/${subproject.id}/revisions`);
  };

  const handleCreateSubproject = async (formData: Record<string, string>) => {
    console.log('Creating subproject with data:', formData);
    try {
      if (!projectId) {
        throw new Error('Project ID is required to create a subproject');
      }

      const newSubproject = await subprojectService.createSubproject(parseInt(projectId), {
        title: formData.title,
        description: formData.description || null
      });
      console.log('Subproject created:', newSubproject);
      // Refresh the subprojects list
      const updatedSubprojects = await subprojectService.getSubprojects(parseInt(projectId));
      setSubprojects(updatedSubprojects);
    } catch (error) {
      console.error('Error creating subproject:', error);
    }
  };

  // Filter subprojects by project if projectId is provided
  const filterSubprojectsByProject = (subprojects: Subproject[], params: Record<string, unknown>) => {
    const projectId = params.projectId as string;
    if (!projectId) return subprojects;

    // Filter by actual project_id relationship
    return subprojects.filter(subproject => subproject.project_id.toString() === projectId);
  };

  // Get project title for the page title
  const getProjectTitle = () => {
    if (!projectId) return '';
    const project = projects.find(p => p.id.toString() === projectId);
    return project?.title || '';
  };

  const handleDeleteSubproject = async (subproject: Subproject) => {
    console.log('Deleting subproject:', subproject.id);
    try {
      await subprojectService.deleteSubproject(subproject.id);
      if (projectId) {
        const updatedSubprojects = await subprojectService.getSubprojects(parseInt(projectId));
        setSubprojects(updatedSubprojects);
      } else {
        // Refresh all subprojects
        const allProjects = await projectService.getProjects();
        const allSubprojects: Subproject[] = [];
        for (const project of allProjects) {
          const projectSubprojects = await subprojectService.getSubprojects(project.id);
          allSubprojects.push(...projectSubprojects);
        }
        setSubprojects(allSubprojects);
      }
    } catch (error) {
      console.error('Error deleting subproject:', error);
    }
  };

  return (
    <>
      <Navigation />
      {isLoading && <CircularLoader />}
      {!isLoading &&
        <DataGrid<Subproject>
          title={projectId ? `Подпроекты проекта "${getProjectTitle()}"` : 'Подпроекты'}
          items={subprojects}
          renderCard={(subproject) => (
            <DataCard
              title={subproject.title}
            >
              <Button variant="outlined" color="danger" size="sm" onClick={() => handleDeleteSubproject(subproject)}>
                Удалить
              </Button>
              <Button variant="outlined" color="neutral" size="sm" onClick={() => handleSubprojectClick(subproject)}>
                Открыть
              </Button>
            </DataCard>
          )}
          onCreateItem={handleCreateSubproject}
          createModalTitle="Создать подпроект"
          createModalDescription="Заполните информацию о подпроекте."
          createButtonText="Создать подпроект"
          formFields={[
            { name: 'title', label: 'Название подпроекта', required: true },
            { name: 'description', label: 'Описание подпроекта', required: false }
          ]}
          emptyStateTitle="Нет подпроектов"
          emptyStateDescription={projectId
            ? "В этом проекте пока нет подпроектов"
            : "Создайте свой первый подпроект для начала"
          }
          filterFunction={projectId ? filterSubprojectsByProject : undefined}
          filterParams={projectId ? { projectId } : {}}
        />
      }
    </>
  );
};

export default SubprojectsPage; 