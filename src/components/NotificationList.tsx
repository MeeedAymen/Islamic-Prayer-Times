import React from 'react';
import { Bell, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { formatDate } from '../utils/dateTimeUtils';

const NotificationList: React.FC = () => {
  const { notifications, clearNotifications } = useNotification();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-h-96 overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors duration-300">
      <div className="p-3 bg-primary-600 text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <Bell size={16} className="mr-2" />
          <h3 className="font-medium">Recent Notifications</h3>
        </div>
        <button 
          onClick={clearNotifications}
          className="p-1 hover:bg-primary-700 rounded transition-colors"
          aria-label="Clear all notifications"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.slice(-5).map((notification) => (
          <div 
            key={notification.id} 
            className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              notification.type === 'prayer' 
                ? 'border-l-4 border-primary-500' 
                : notification.type === 'adkar'
                ? 'border-l-4 border-secondary-500'
                : 'border-l-4 border-gray-500'
            }`}
          >
            <h4 className="font-medium text-gray-800 dark:text-white">{notification.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{notification.message}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(notification.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;