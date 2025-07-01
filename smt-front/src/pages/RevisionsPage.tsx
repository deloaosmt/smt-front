import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { Revision } from '../types/revision';
import type { Subproject } from '../types/subpoject';
import type { Project } from '../types/project';
import { revisionService, subprojectService, projectService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';
import Button from '@mui/joy/Button';
import { DialogContent, DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack, Select, Option } from '@mui/joy';

const RevisionsPage = () => {
  const { subprojectId } = useParams<{ subprojectId?: string }>();
  const navigate = useNavigate();
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('Ревизии');
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<Revision | null>(null);

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentSubproject, setCurrentSubproject] = useState<Subproject | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (subprojectId) {
        const subproject = await subprojectService.getSubproject(parseInt(subprojectId));
        const project = await projectService.getProject(subproject.project_id);
        const subprojectRevisions = await revisionService.getRevisions(parseInt(subprojectId));

        setCurrentSubproject(subproject);
        setCurrentProject(project);
        setRevisions(subprojectRevisions);
        setTitle(`Ревизии подпроекта "${subproject.title}"`);
      } else {
        setTitle('Ревизии');
        setCurrentProject(null);
        setCurrentSubproject(null);
        const allProjects = await projectService.getProjects();
        const allSubprojects: Subproject[] = [];
        const allRevisions: Revision[] = [];

        for (const project of allProjects) {
          const projectSubprojects = await subprojectService.getSubprojects(project.id);
          allSubprojects.push(...projectSubprojects);

          for (const subproject of projectSubprojects) {
            const subprojectRevisions = await revisionService.getRevisions(subproject.id);
            allRevisions.push(...subprojectRevisions);
          }
        }

        setProjects(allProjects);
        setSubprojects(allSubprojects);
        setRevisions(allRevisions);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [subprojectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRevisionClick = (revision: Revision) => {
    let project = currentProject;
    let subproject: Subproject | null = currentSubproject;

    if (!subproject || !project) {
      subproject = subprojects.find(s => s.id === revision.subproject_id) || null;
      if (subproject) {
        project = projects.find(p => p.id === subproject!.project_id) || null;
      }
    }

    if (!project || !subproject) {
      console.error('Could not find project or subproject for revision:', revision.id);
      return;
    }

    const filesUrl = `/files?projectId=${project.id}&subprojectId=${subproject.id}&revisionId=${revision.id}`;
    navigate(filesUrl);
  };

  const handleCreateRevision = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const revisionNumber = formData.get('revisionNumber') as string;
    const targetSubprojectId = subprojectId || formData.get('subprojectId') as string;

    if (!targetSubprojectId) {
      console.error('Subproject ID is required to create a revision');
      return;
    }

    try {
      await revisionService.createRevision(parseInt(targetSubprojectId), {
        revision_number: parseInt(revisionNumber),
        title: title,
        description: description || null
      });
      setCreateModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Error creating revision:', error);
    }
  };

  const handleDeleteRevision = async (revision: Revision) => {
    try {
      await revisionService.deleteRevision(revision.id);
      setDeleteModalOpen(null);
      await loadData();
    } catch (error) {
      console.error('Error deleting revision:', error);
    }
  };

  const deleteModal = (
    <Modal open={deleteModalOpen !== null} onClose={() => setDeleteModalOpen(null)}>
      <ModalDialog>
        <DialogTitle>Удалить ревизию</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p>Вы уверены, что хотите удалить ревизию {deleteModalOpen?.title}?</p>
          <Stack direction="row" spacing={2} justifyContent="space-around">
            <Button variant="outlined" color="danger" onClick={() => handleDeleteRevision(deleteModalOpen!)}>
              Удалить
            </Button>
            <Button variant="outlined" color="neutral" onClick={() => setDeleteModalOpen(null)}>
              Отмена
            </Button>
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );

  const createModal = (
    <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
      <ModalDialog>
        <DialogTitle>Создать ревизию</DialogTitle>
        <DialogContent>Заполните информацию о ревизии.</DialogContent>
        <form onSubmit={handleCreateRevision}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Название ревизии</FormLabel>
              <Input required name="title" />
            </FormControl>
            <FormControl>
              <FormLabel>Описание ревизии</FormLabel>
              <Input name="description" />
            </FormControl>
            <FormControl>
              <FormLabel>Номер ревизии</FormLabel>
              <Input required name="revisionNumber" type="number" />
            </FormControl>
            <FormControl>
              <FormLabel>Подпроект</FormLabel>
              <Select name="subprojectId" required placeholder="Выберите подпроект" defaultValue={subprojectId}>
                {subprojectId && currentSubproject 
                  ? <Option value={currentSubproject.id}>{currentSubproject.title}</Option>
                  : subprojects.map(subproject => (
                      <Option key={subproject.id} value={subproject.id}>{subproject.title}</Option>
                    ))
                }
              </Select>
            </FormControl>
            <Button type="submit">Создать ревизию</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );

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
              title={revision.title}
            >
              <Button variant="outlined" color="danger" size="sm" onClick={() => setDeleteModalOpen(revision)}>
                Удалить
              </Button>
              <Button variant="outlined" color="neutral" size="sm" onClick={() => handleRevisionClick(revision)}>
                Открыть
              </Button>
            </DataCard>
          )}
          onCreateItem={() => setCreateModalOpen(true)}
          emptyStateTitle="Нет ревизий"
          emptyStateDescription={subprojectId
            ? "В этом подпроекте пока нет ревизий"
            : "Создайте свою первую ревизию для начала"
          }
          filterFunction={subprojectId ? filterRevisionsBySubproject : undefined}
          filterParams={subprojectId ? { subprojectId } : {}}
        />
      }
      {createModal}
      {deleteModal}
    </>
  );
};

export default RevisionsPage; 