import React from 'react';
import { Clock } from 'lucide-react';
import { Prayer } from '../types';
import { formatPrayerTime, getTimeUntilNextPrayer, getCurrentPrayer } from '../utils/dateTimeUtils';

interface PrayerTimesCardProps {
  prayers: Prayer[];
  isLoading: boolean;
  error: string | null;
}

const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({ prayers, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 animate-pulse transition-colors duration-300">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <Clock size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
          Prayer Times
        </h2>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const nextPrayer = getTimeUntilNextPrayer(prayers);
  const currentPrayer = getCurrentPrayer(prayers);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
        <Clock size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
        Prayer Times
      </h2>
      
      <div className="mb-6 bg-primary-50 dark:bg-primary-900/10 rounded-lg p-4">
        <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-1">Next Prayer</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-primary-700 dark:text-primary-300">{nextPrayer.name}</p>
            <p className="text-sm font-arabic text-primary-600 dark:text-primary-400">{nextPrayer.arabicName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-300">In</p>
            <p className="text-lg font-semibold text-primary-700 dark:text-primary-300">{nextPrayer.timeLeft}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {prayers.map((prayer) => (
          <div 
            key={prayer.name}
            className={`flex justify-between items-center p-2 rounded-md ${
              currentPrayer && currentPrayer.name === prayer.name
                ? 'bg-primary-100 dark:bg-primary-900/30'
                : nextPrayer.name === prayer.name
                ? 'bg-secondary-50 dark:bg-secondary-900/20'
                : ''
            }`}
          >
            <div className="flex items-center">
              <span 
                className={`w-2 h-2 rounded-full mr-3 ${
                  currentPrayer && currentPrayer.name === prayer.name
                    ? 'bg-primary-600'
                    : nextPrayer.name === prayer.name
                    ? 'bg-secondary-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              ></span>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{prayer.name}</p>
                <p className="text-xs font-arabic text-gray-600 dark:text-gray-400">{prayer.arabicName}</p>
              </div>
            </div>
            <p className="font-medium text-gray-700 dark:text-gray-300">{formatPrayerTime(prayer.time)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimesCard;