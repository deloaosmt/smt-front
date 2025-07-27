import { useAtom } from 'jotai';
import { useRef, useCallback } from 'react';
import { Modal, ModalDialog, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Button, Option } from '@mui/joy';
import {
  createModalOpenAtom,
  selectedFileAtom,
} from './files-ui-state';
import { useFilesState } from './use-files-state';

export function CreateFileModal() {
  const [createModalOpen] = useAtom(createModalOpenAtom);
  const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);

  const { 
    handleCreateFileWithData,
    handleCloseCreateModal,
    handleModalStateChange,
    createModalState,
    projects,
    modalSubprojects,
    modalRevisions,
    documentTypes,
    isModalLoading
  } = useFilesState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle project selection change
  const handleProjectChange = useCallback((projectId: string | null) => {
    handleModalStateChange({
      projectId,
      subprojectId: null, // Reset dependent fields
      revisionId: null
    });
  }, [handleModalStateChange]);

  // Handle subproject selection change
  const handleSubprojectChange = useCallback((subprojectId: string | null) => {
    handleModalStateChange({
      subprojectId,
      revisionId: null // Reset dependent field
    });
  }, [handleModalStateChange]);

  // Handle revision selection change
  const handleRevisionChange = useCallback((revisionId: string | null) => {
    handleModalStateChange({ revisionId });
  }, [handleModalStateChange]);

  // Handle form submission
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!selectedFile || !createModalState.name || !createModalState.projectId || 
        !createModalState.subprojectId || !createModalState.revisionId || 
        !createModalState.documentType) {
      return;
    }

    const fileData = {
      name: createModalState.name,
      document_type: createModalState.documentType,
      project_id: parseInt(createModalState.projectId),
      subproject_id: parseInt(createModalState.subprojectId),
      revision_id: parseInt(createModalState.revisionId)
    };

    handleCreateFileWithData(fileData, selectedFile);
  }, [createModalState, selectedFile, handleCreateFileWithData]);

  return (
    <Modal open={createModalOpen} onClose={handleCloseCreateModal}>
      <ModalDialog>
        <DialogTitle>Создать документ</DialogTitle>
        <DialogContent>Заполните информацию о документе.</DialogContent>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Название документа</FormLabel>
              <Input 
                required 
                value={createModalState.name}
                onChange={(e) => handleModalStateChange({ name: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Проект</FormLabel>
              <Select
                required
                placeholder="Выберите проект"
                value={createModalState.projectId}
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
                value={createModalState.subprojectId}
                onChange={(_, value) => handleSubprojectChange(value)}
                disabled={!createModalState.projectId || modalSubprojects.length === 0}
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
                value={createModalState.revisionId}
                onChange={(_, value) => handleRevisionChange(value)}
                disabled={!createModalState.subprojectId || modalRevisions.length === 0}
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
                value={createModalState.documentType}
                onChange={(_, value) => handleModalStateChange({ documentType: value })}
                disabled={isModalLoading}
              >
                {documentTypes.map(fileType => (
                  <Option key={fileType.type} value={fileType.type}>{fileType.name}</Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Файл</FormLabel>
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color={selectedFile ? 'success' : 'neutral'}
              >
                {selectedFile ? selectedFile.name : 'Выбрать файл'}
                <input
                  ref={fileInputRef}
                  style={{
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: 1,
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    whiteSpace: 'nowrap',
                    width: 1,
                  }}
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </Button>
            </FormControl>
            <Button 
              type="submit" 
              disabled={!selectedFile || isModalLoading}
            >
              Создать документ
            </Button>
          </Stack>
        </form>

      </ModalDialog>
    </Modal>
  );
} 