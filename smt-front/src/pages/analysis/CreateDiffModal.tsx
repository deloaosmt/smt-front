import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Modal, ModalDialog, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Button, Option, Typography } from '@mui/joy';
import {
  createDiffModalOpenAtom,
} from './analysis-ui-state';
import { useAnalysisState } from './use-analysis-state';

export function CreateDiffModal() {
  const [createDiffModalOpen] = useAtom(createDiffModalOpenAtom);

  const { 
    handleCreateDiff,
    handleCloseCreateDiffModal,
    handleModalStateChange,
    createDiffModalState,
    projects,
    modalSubprojects,
    modalRevisions,
    documentTypes,
    availableFilesForDiff,
    isModalLoading
  } = useAnalysisState();

  // Handle project selection change
  const handleProjectChange = useCallback((projectId: string | null) => {
    handleModalStateChange({
      projectId,
      subprojectId: null, // Reset dependent fields
      revisionId: null,
      firstFileId: null,
      secondFileId: null
    });
  }, [handleModalStateChange]);

  // Handle subproject selection change
  const handleSubprojectChange = useCallback((subprojectId: string | null) => {
    handleModalStateChange({
      subprojectId,
      revisionId: null, // Reset dependent field
      firstFileId: null,
      secondFileId: null
    });
  }, [handleModalStateChange]);

  // Handle revision selection change
  const handleRevisionChange = useCallback((revisionId: string | null) => {
    handleModalStateChange({ 
      revisionId,
      firstFileId: null,
      secondFileId: null
    });
  }, [handleModalStateChange]);

  // Handle document type change
  const handleDocumentTypeChange = useCallback((documentType: string | null) => {
    handleModalStateChange({ 
      documentType,
      firstFileId: null,
      secondFileId: null
    });
  }, [handleModalStateChange]);

  // Handle form submission
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!createDiffModalState.name || !createDiffModalState.projectId || 
        !createDiffModalState.subprojectId || !createDiffModalState.revisionId || 
        !createDiffModalState.documentType || !createDiffModalState.firstFileId ||
        !createDiffModalState.secondFileId) {
      return;
    }

    const diffData = {
      name: createDiffModalState.name,
      document_type: createDiffModalState.documentType,
      project_id: parseInt(createDiffModalState.projectId),
      subproject_id: parseInt(createDiffModalState.subprojectId),
      revision_id: parseInt(createDiffModalState.revisionId),
      first_file_id: parseInt(createDiffModalState.firstFileId),
      second_file_id: parseInt(createDiffModalState.secondFileId)
    };

    handleCreateDiff(diffData);
  }, [createDiffModalState, handleCreateDiff]);

  // Filter available files for second file selection (exclude first file)
  const availableSecondFiles = availableFilesForDiff.filter(
    file => file.id.toString() !== createDiffModalState.firstFileId
  );

  const isFormValid = createDiffModalState.name && 
                     createDiffModalState.projectId && 
                     createDiffModalState.subprojectId && 
                     createDiffModalState.revisionId && 
                     createDiffModalState.documentType && 
                     createDiffModalState.firstFileId && 
                     createDiffModalState.secondFileId;

  return (
    <Modal open={createDiffModalOpen} onClose={handleCloseCreateDiffModal}>
      <ModalDialog>
        <DialogTitle>Создать сравнение</DialogTitle>
        <DialogContent>Выберите два файла для сравнения.</DialogContent>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Название сравнения</FormLabel>
              <Input 
                required 
                value={createDiffModalState.name}
                onChange={(e) => handleModalStateChange({ name: e.target.value })}
                placeholder="Введите название для файла сравнения"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Проект</FormLabel>
              <Select
                required
                placeholder="Выберите проект"
                value={createDiffModalState.projectId}
                onChange={(_, value) => handleProjectChange(value)}
                disabled={isModalLoading}
              >
                {projects.map(project => (
                  <Option key={project.id} value={project.id.toString()}>
                    {project.title}
                  </Option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Подпроект</FormLabel>
              <Select
                required
                placeholder="Выберите подпроект"
                value={createDiffModalState.subprojectId}
                onChange={(_, value) => handleSubprojectChange(value)}
                disabled={!createDiffModalState.projectId || modalSubprojects.length === 0}
              >
                {modalSubprojects.map(subproject => (
                  <Option key={subproject.id} value={subproject.id.toString()}>
                    {subproject.title}
                  </Option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Изм</FormLabel>
              <Select
                required
                placeholder="Выберите изм"
                value={createDiffModalState.revisionId}
                onChange={(_, value) => handleRevisionChange(value)}
                disabled={!createDiffModalState.subprojectId || modalRevisions.length === 0}
              >
                {modalRevisions.map(revision => (
                  <Option key={revision.id} value={revision.id.toString()}>
                    {revision.title}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Тип документа</FormLabel>
              <Select 
                required 
                placeholder="Выберите тип документа"
                value={createDiffModalState.documentType}
                onChange={(_, value) => handleDocumentTypeChange(value)}
                disabled={isModalLoading}
              >
                {documentTypes.map(fileType => (
                  <Option key={fileType.type} value={fileType.type}>{fileType.name}</Option>
                ))}
              </Select>
            </FormControl>

            <Typography level="title-sm" sx={{ mt: 2 }}>
              Файлы для сравнения
            </Typography>

            <FormControl>
              <FormLabel>Первый файл</FormLabel>
              <Select 
                required 
                placeholder="Выберите первый файл"
                value={createDiffModalState.firstFileId}
                onChange={(_, value) => handleModalStateChange({ 
                  firstFileId: value,
                  secondFileId: value === createDiffModalState.secondFileId ? null : createDiffModalState.secondFileId
                })}
                disabled={availableFilesForDiff.length === 0}
              >
                {availableFilesForDiff.map(file => (
                  <Option key={file.id} value={file.id.toString()}>
                    {file.name}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Второй файл</FormLabel>
              <Select 
                required 
                placeholder="Выберите второй файл"
                value={createDiffModalState.secondFileId}
                onChange={(_, value) => handleModalStateChange({ secondFileId: value })}
                disabled={!createDiffModalState.firstFileId || availableSecondFiles.length === 0}
              >
                {availableSecondFiles.map(file => (
                  <Option key={file.id} value={file.id.toString()}>
                    {file.name}
                  </Option>
                ))}
              </Select>
            </FormControl>

            {availableFilesForDiff.length === 0 && createDiffModalState.documentType && (
              <Typography level="body-sm" color="warning">
                Нет доступных файлов для выбранных параметров
              </Typography>
            )}

            <Button 
              type="submit" 
              disabled={!isFormValid || isModalLoading}
            >
              Создать сравнение
            </Button>
          </Stack>
        </form>

      </ModalDialog>
    </Modal>
  );
} 