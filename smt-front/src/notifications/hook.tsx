import { useNotificationContext } from './useNotificationContext';
import type { NotificationHookReturn } from './types';

const useNotification = (): NotificationHookReturn => {
  const { showNotification } = useNotificationContext();

  const notifySuccess = (message: string, duration?: number) => {
    showNotification(message, 'success', duration);
  };

  const notifyError = (message: string, duration?: number) => {
    showNotification(message, 'error', duration);
  };

  const notifyWarning = (message: string, duration?: number) => {
    showNotification(message, 'warning', duration);
  };

  const notifyInfo = (message: string, duration?: number) => {
    showNotification(message, 'info', duration);
  };

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
};

export default useNotification;
