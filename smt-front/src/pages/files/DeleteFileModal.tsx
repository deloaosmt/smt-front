import { useAtom } from 'jotai';
import { Modal, ModalDialog, DialogTitle, DialogContent, Stack, Button } from '@mui/joy';
import { deleteModalOpenAtom } from './files-ui-state';
import { useFilesState } from './use-files-state';

export function DeleteFileModal() {
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(deleteModalOpenAtom);
  const { handleDeleteFile } = useFilesState();

  return (
    <Modal open={deleteModalOpen !== null} onClose={() => setDeleteModalOpen(null)}>
      <ModalDialog>
        <DialogTitle>Удалить документ</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p>Вы уверены, что хотите удалить документ {deleteModalOpen?.name}?</p>
          <Stack direction="row" spacing={2} justifyContent="space-around">
            <Button variant="outlined" color="danger" onClick={() => handleDeleteFile(deleteModalOpen!)}>
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
} 