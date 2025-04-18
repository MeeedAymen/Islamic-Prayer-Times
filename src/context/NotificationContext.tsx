import React, { createContext, useState, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import { NotificationItem, NotificationContextType } from '../types';
import { v4 as uuidv4 } from '../utils/uuidUtils';

const defaultNotificationContext: NotificationContextType = {
  notifications: [],
  showNotification: () => {},
  clearNotifications: () => {},
};

const NotificationContext = createContext<NotificationContextType>(defaultNotificationContext);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback(
    ({ title, message, type }: Omit<NotificationItem, 'id' | 'timestamp'>) => {
      const newNotification: NotificationItem = {
        id: uuidv4(),
        title,
        message,
        type,
        timestamp: new Date(),
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Also show a toast notification
      toast(
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p>{message}</p>
        </div>,
        {
          type: type === 'prayer' ? 'info' : type === 'adkar' ? 'success' : 'default',
        }
      );

      // Request permission for browser notifications if not already granted
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }

      // Show browser notification if permission is granted
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/mosque-icon.svg',
        });
      }
    },
    []
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};