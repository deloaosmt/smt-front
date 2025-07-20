import { useContext } from 'react';
import type { NotificationContextType } from './types';
import { NotificationContext } from './context';

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}; 
