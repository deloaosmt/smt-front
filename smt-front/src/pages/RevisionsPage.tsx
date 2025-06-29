import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { Revision } from '../types/revision';
import type { Subproject } from '../types/subpoject';
import type { Project } from '../types/project';
import { revisionService, subprojectService, projectService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';

const RevisionsPage = () => {
  const { subprojectId } = useParams<{ subprojectId?: string }>();
  const navigate = useNavigate();
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('Ревизии');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (subprojectId) {
          // Load revisions for specific subproject
          const subprojectRevisions = await revisionService.getRevisionsBySubproject(parseInt(subprojectId));
          setRevisions(subprojectRevisions);
          
          // Load subproject and project info
          const subproject = await subprojectService.getItem(subprojectId);
          setSubprojects([subproject]);
          
          const project = await projectService.getItem(subproject.project_id.toString());
          setProjects([project]);
          
          setTitle(`Ревизии подпроекта "${subproject.title}"`);
        } else {
          // Load all revisions
          const allRevisions = await revisionService.getItems();
          setRevisions(allRevisions);
          
          // Load all subprojects and projects for reference
          const allSubprojects = await subprojectService.getItems();
          setSubprojects(allSubprojects);
          
          const allProjects = await projectService.getItems();
          setProjects(allProjects);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [subprojectId]);

  const handleRevisionClick = (revision: Revision) => {
    console.log('Revision clicked:', revision.id);
    
    // Get the subproject and project information
    const subproject = subprojects.find(s => s.id === revision.subproject_id);
    if (!subproject) {
      console.error('Subproject not found for revision:', revision.id);
      return;
    }
    
    const project = projects.find(p => p.id === subproject.project_id);
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
      if (!subprojectId) {
        throw new Error('Subproject ID is required to create a revision');
      }
      
      const newRevision = await revisionService.createItem({
        revision_number: parseInt(formData.revisionNumber),
        title: formData.title,
        description: formData.description || null,
        subproject_id: parseInt(subprojectId)
      });
      console.log('Revision created:', newRevision);
      // Refresh the revisions list
      const updatedRevisions = await revisionService.getRevisionsBySubproject(parseInt(subprojectId));
      setRevisions(updatedRevisions);
    } catch (error) {
      console.error('Error creating revision:', error);
    }
  };

  // Filter revisions by subproject if subprojectId is provided
  const filterRevisionsBySubproject = (revisions: Revision[], params: Record<string, unknown>) => {
    const subprojectId = params.subprojectId as string;
    if (!subprojectId) return revisions;
    
    // Filter by actual subproject_id relationship
    return revisions.filter(revision => revision.subproject_id.toString() === subprojectId);
  };

  return (
    <>
      <Navigation />
      {isLoading && <CircularLoader />}
      {!isLoading &&
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
            { name: 'description', label: 'Описание ревизии', required: false },
            { name: 'revisionNumber', label: 'Номер ревизии', required: true }
          ]}
          emptyStateTitle="Нет ревизий"
          emptyStateDescription={subprojectId 
            ? "В этом подпроекте пока нет ревизий" 
            : "Создайте свою первую ревизию для начала"
          }
          filterFunction={subprojectId ? filterRevisionsBySubproject : undefined}
          filterParams={subprojectId ? { subprojectId } : {}}
        />
      }
    </>
  );
};

export default RevisionsPage; 