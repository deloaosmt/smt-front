
import { Snackbar, Alert } from '@mui/joy';
import type { SnackbarCloseReason } from '@mui/joy/Snackbar';
import { useNotificationContext } from './useNotificationContext';

const NotificationSystem = () => {
  const { open, message, severity, autoHideDuration, hideNotification } = useNotificationContext();

  const handleClose = (_event: React.SyntheticEvent | Event | null, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    hideNotification();
  };

  // Map notification severity to MUI Joy color
  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'primary';
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        color={getAlertColor(severity)} 
        variant="soft"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSystem;
