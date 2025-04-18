import React from 'react';
import { NotificationItem } from '../types';

interface NotificationListProps {
  notifications: NotificationItem[];
  onClear?: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onClear }) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 w-96 max-w-full space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg p-4 shadow-lg transition-all duration-300 ${
            notification.type === 'prayer'
              ? 'bg-blue-100 dark:bg-blue-800'
              : notification.type === 'adkar'
              ? 'bg-green-100 dark:bg-green-800'
              : 'bg-purple-100 dark:bg-purple-800'
          }`}
        >
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {notification.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-200">{notification.message}</p>
          <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {notification.timestamp.toLocaleTimeString()}
          </span>
        </div>
      ))}
      {onClear && notifications.length > 0 && (
        <button
          onClick={onClear}
          className="w-full rounded-lg bg-gray-200 p-2 text-sm font-medium text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Clear all notifications
        </button>
      )}
    </div>
  );
};

export default NotificationList;
