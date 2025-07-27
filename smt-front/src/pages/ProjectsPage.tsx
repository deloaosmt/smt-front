import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { Project } from '../types/project';
import { projectService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';
import Button from '@mui/joy/Button';
import { DialogContent, DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack } from '@mui/joy';
import { truncate } from '../common/TextUtils';
import useNotification from '../notifications/hook';
import { getErrorMessage } from '../common/OnError';
import SinglePage from '../components/SinglePage';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState<Project | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const allProjects = await projectService.getProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      notifyError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    try {
      await projectService.createProject({
        title: title,
        description: description || null
      });
      setCreateModalOpen(false);
      await loadData();
      notifySuccess('Проект успешно создан');
    } catch (error) {
      console.error('Error creating project:', error);
      notifyError(getErrorMessage(error));
    }
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      await projectService.deleteProject(project.id);
      setDeleteModalOpen(null);
      await loadData();
      notifySuccess('Проект успешно удален');
    } catch (error) {
      console.error('Error deleting project:', error);
      notifyError(getErrorMessage(error));
    }
  };

  const renderCard = useCallback((project: Project) => (
    <DataCard title={truncate(project.title)} >
      <Button variant="outlined" color="danger" size="sm" onClick={() => setDeleteModalOpen(project)}>
        Удалить
      </Button>
      <Button variant="outlined" color="neutral" size="sm" onClick={() => navigate(`/projects/${project.id}/subprojects`)}>
        Открыть
      </Button>
    </DataCard>
  ), [navigate]);

  const deleteModal = (
    <Modal open={deleteModalOpen !== null} onClose={() => setDeleteModalOpen(null)}>
      <ModalDialog>
        <DialogTitle>Удалить проект</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p>Вы уверены, что хотите удалить проект {deleteModalOpen?.title}?</p>
          <Stack direction="row" spacing={2} justifyContent="space-around">
            <Button variant="outlined" color="danger" onClick={() => handleDeleteProject(deleteModalOpen!)}>
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
        <DialogTitle>Создать проект</DialogTitle>
        <DialogContent>Заполните информацию о проекте.</DialogContent>
        <form onSubmit={handleCreateProject}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Название проекта</FormLabel>
              <Input required name="title" />
            </FormControl>
            <FormControl>
              <FormLabel>Описание проекта</FormLabel>
              <Input name="description" />
            </FormControl>
            <Button type="submit">Создать проект</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );

  return (
    <SinglePage>
      {isLoading && <CircularLoader />}
      {!isLoading &&
        <DataGrid<Project>
          title="Проекты"
          items={projects}
          renderCard={renderCard}
          onCreateItem={() => setCreateModalOpen(true)}
          emptyStateTitle="Нет проектов"
          emptyStateDescription="Создайте свой первый проект для начала"
        />
      }
      {createModal}
      {deleteModal}
    </SinglePage>
  );
};

export default ProjectsPage; 