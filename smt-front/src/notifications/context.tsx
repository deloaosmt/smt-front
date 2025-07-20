import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { NotificationContextType, NotificationSeverity } from './types';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<NotificationSeverity>('info');
  const [autoHideDuration, setAutoHideDuration] = useState(6000);

  const showNotification = (
    message: string, 
    severity: NotificationSeverity = 'info', 
    duration: number = 5000
  ) => {
    setMessage(message);
    setSeverity(severity);
    setAutoHideDuration(duration);
    setOpen(true);
  };

  const hideNotification = () => {
    setOpen(false);
  };

  const value: NotificationContextType = {
    open,
    message,
    severity,
    autoHideDuration,
    showNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Export the context for use in other files
export { NotificationContext }; 