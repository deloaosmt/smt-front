export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface NotificationContextType {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
  autoHideDuration: number;
  showNotification: (message: string, severity?: NotificationSeverity, duration?: number) => void;
  hideNotification: () => void;
}

export interface NotificationHookReturn {
  notifySuccess: (message: string, duration?: number) => void;
  notifyError: (message: string, duration?: number) => void;
  notifyWarning: (message: string, duration?: number) => void;
  notifyInfo: (message: string, duration?: number) => void;
} 