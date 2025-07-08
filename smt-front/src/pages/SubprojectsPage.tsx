import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import Navigation from '../components/Navigation';
import DataGrid from '../components/DataGrid';
import DataCard from '../components/DataCard';
import type { Subproject } from '../types/subpoject';
import type { Project } from '../types/project';
import type { File } from '../types/file';
import { projectService, subprojectService, fileService, diffService } from '../api/Services';
import { CircularLoader } from '../components/CircularLoader';
import { Button, DialogContent, DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Option, Select, Stack } from '@mui/joy';

const SubprojectsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Analysis modal states
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [selectedSubproject, setSelectedSubproject] = useState<Subproject | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ diffname: string | null, left: string | null, right: string | null }>({ diffname: null, left: null, right: null });
  const [isCreatingDiff, setIsCreatingDiff] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    if (projectId) {
      const project = await projectService.getProject(parseInt(projectId));
      const projectSubprojects = await subprojectService.getSubprojects(parseInt(projectId));
      setCurrentProject(project);
      setSubprojects(projectSubprojects);
    } else {
      setCurrentProject(null);
      const allProjects = await projectService.getProjects();
      setProjects(allProjects);

      const allSubprojects: Subproject[] = [];
      for (const project of allProjects) {
        const projectSubprojects = await subprojectService.getSubprojects(project.id);
        allSubprojects.push(...projectSubprojects);
      }
      setSubprojects(allSubprojects);
    }
    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateSubproject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const targetProjectId = projectId || formData.get('projectId') as string;

    await subprojectService.createSubproject(parseInt(targetProjectId), {
      title: title,
      description: description || null
    });

    setCreateModalOpen(false);
    await loadData();
  };

  const filterSubprojectsByProject = (subprojects: Subproject[], params: Record<string, unknown>) => {
    const projectId = params.projectId as string;
    if (!projectId) return subprojects;

    return subprojects.filter(subproject => subproject.project_id.toString() === projectId);
  };

  const handleDeleteSubproject = async (subproject: Subproject) => {
    console.log('Deleting subproject:', subproject.id);
    try {
      await subprojectService.deleteSubproject(subproject.id);
      await loadData();
    } catch (error) {
      console.error('Error deleting subproject:', error);
    }
    setDeleteModalOpen(null);
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState<Subproject | null>(null);

  const deleteModal = (
    <Modal open={deleteModalOpen !== null} onClose={() => setDeleteModalOpen(null)}>
      <ModalDialog>
        <DialogTitle>Удалить подпроект</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p>Вы уверены, что хотите удалить подпроект {deleteModalOpen?.title}?</p>
          <Stack direction="row" spacing={2} justifyContent="space-around">
            <Button variant="outlined" color="danger" onClick={() => handleDeleteSubproject(deleteModalOpen!)}>
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

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const createModal = (
    <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
      <ModalDialog>
        <DialogTitle>Создать подпроект</DialogTitle>
        <DialogContent>Заполните информацию о подпроекте.</DialogContent>
        <form onSubmit={handleCreateSubproject}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Название подпроекта</FormLabel>
              <Input required name="title" />
            </FormControl>
            <FormControl>
              <FormLabel>Описание подпроекта</FormLabel>
              <Input name="description" />
            </FormControl>
            <FormControl>
              <FormLabel>Проект</FormLabel>
              <Select name="projectId" required>
                {projectId && currentProject
                  ? <Option value={currentProject.id}>{currentProject.title}</Option>
                  : projects.map(project => (
                    <Option value={project.id}>{project.title}</Option>
                  ))
                }
              </Select>
            </FormControl>
            <Button type="submit">Создать подпроект</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );

  const handleOpenAnalysisModal = async (subproject: Subproject) => {
    setSelectedSubproject(subproject);
    setSelectedFiles({ diffname: null, left: null, right: null });
    setIsCreatingDiff(false);

    try {
      // Get all files for this subproject
      const allFiles = await fileService.getFiles();
      const subprojectFiles = allFiles.filter(file => file.subproject_id === subproject.id);
      setFiles(subprojectFiles);
      setAnalysisModalOpen(true);
    } catch (error) {
      console.error('Error loading files for subproject:', error);
    }
  };

  const handleCreateDiff = async () => {
    if (!selectedFiles.left || !selectedFiles.right) {
      console.error('Both files must be selected');
      return;
    }

    setIsCreatingDiff(true);
    try {
      const result = await diffService.createDiff({
        name: selectedFiles.diffname || `Diff ${new Date().toISOString()}`,
        doc_id_left: parseInt(selectedFiles.left),
        doc_id_right: parseInt(selectedFiles.right),
        target_subproject_id: selectedSubproject?.id,
        target_project_id: selectedSubproject?.project_id
      });

      console.log('Diff created:', result);
      setAnalysisModalOpen(false);
      // Optionally navigate to the created diff file or show a success message
    } catch (error) {
      console.error('Error creating diff:', error);
    } finally {
      setIsCreatingDiff(false);
    }
  };

  const analysisModal = (
    <Modal open={analysisModalOpen} onClose={() => !isCreatingDiff && setAnalysisModalOpen(false)}>
      <ModalDialog size="lg">
        <DialogTitle>Анализ подпроекта</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <p>Выберите два файла для анализа.</p>

            <FormControl>
              <FormLabel>Название дифф-файла</FormLabel>
              <Input onChange={(e) => setSelectedFiles(prev => ({ ...prev, diffname: e.target.value }))} />
            </FormControl>

            <FormControl>
              <FormLabel>Первый файл</FormLabel>
              <Select
                value={selectedFiles.left}
                onChange={(_, value) => setSelectedFiles(prev => ({ ...prev, left: value }))}
                placeholder="Выберите первый файл"
              >
                {files.map(file => (
                  <Option key={`left-${file.id}`} value={file.id.toString()}>{file.name}</Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Второй файл</FormLabel>
              <Select
                value={selectedFiles.right}
                onChange={(_, value) => setSelectedFiles(prev => ({ ...prev, right: value }))}
                placeholder="Выберите второй файл"
              >
                {files.map(file => (
                  <Option key={`right-${file.id}`} value={file.id.toString()}>{file.name}</Option>
                ))}
              </Select>
            </FormControl>

            <Button
              onClick={handleCreateDiff}
              disabled={!selectedFiles.left || !selectedFiles.right || !selectedFiles.diffname || isCreatingDiff}
            >
              {isCreatingDiff ? <CircularLoader size="sm" /> : 'Создать анализ'}
            </Button>
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );

  return (
    <>
      <Navigation />
      {isLoading && <CircularLoader />}
      {!isLoading &&
        <DataGrid<Subproject>
          title={currentProject ? `Подпроекты проекта "${currentProject.title}"` : 'Подпроекты'}
          items={subprojects}
          renderCard={(subproject) => (
            <DataCard
              title={subproject.title}
            >
              <Button variant="outlined" color="danger" size="sm" onClick={() => setDeleteModalOpen(subproject)}>
                Удалить
              </Button>
              <Button variant="outlined" color="neutral" size="sm" onClick={() => handleOpenAnalysisModal(subproject)}>
                Анализ
              </Button>
              <Button variant="outlined" color="neutral" size="sm" onClick={() => navigate(`/subprojects/${subproject.id}/revisions`)}>
                Открыть
              </Button>
            </DataCard>
          )}
          onCreateItem={() => setCreateModalOpen(true)}
          emptyStateTitle="Нет подпроектов"
          emptyStateDescription={projectId
            ? "В этом проекте пока нет подпроектов"
            : "Создайте свой первый подпроект для начала"
          }
          filterFunction={projectId ? filterSubprojectsByProject : undefined}
          filterParams={projectId ? { projectId } : {}}
        />
      }
      {deleteModal}
      {createModal}
      {analysisModal}
    </>
  );
};

export default SubprojectsPage; 