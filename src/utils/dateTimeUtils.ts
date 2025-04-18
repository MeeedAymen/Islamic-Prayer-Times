import { format, parse, differenceInMinutes, isToday, addDays } from 'date-fns';
import { Prayer } from '../types';

export const formatPrayerTime = (time: string): string => {
  // Parse the time string and format it to 12-hour format
  const date = parse(time, 'HH:mm', new Date());
  return format(date, 'h:mm a');
};

export const getTimeUntilNextPrayer = (prayers: Prayer[]): { name: string; timeLeft: string; arabicName: string } => {
  if (!prayers || prayers.length === 0) {
    return { name: 'Unknown', timeLeft: 'N/A', arabicName: '' };
  }

  const now = new Date();
  const currentTime = format(now, 'HH:mm');

  // Find the next prayer
  let nextPrayer = prayers.find(prayer => prayer.time > currentTime);

  // If no next prayer today, get the first prayer for tomorrow
  if (!nextPrayer && prayers.length > 0) {
    nextPrayer = prayers[0];
    const tomorrowPrayerTime = addDays(
      parse(nextPrayer.time, 'HH:mm', new Date()),
      1
    );
    
    const diffInMinutes = differenceInMinutes(tomorrowPrayerTime, now);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    return {
      name: nextPrayer.name,
      arabicName: nextPrayer.arabicName,
      timeLeft: `${hours}h ${minutes}m`,
    };
  }

  if (!nextPrayer) {
    return { name: 'Unknown', timeLeft: 'N/A', arabicName: '' };
  }

  // Calculate time difference
  const nextPrayerTime = parse(nextPrayer.time, 'HH:mm', new Date());
  const diffInMinutes = differenceInMinutes(nextPrayerTime, now);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  return {
    name: nextPrayer.name,
    arabicName: nextPrayer.arabicName,
    timeLeft: `${hours}h ${minutes}m`,
  };
};

export const getCurrentPrayer = (prayers: Prayer[]): Prayer | null => {
  if (!prayers || prayers.length === 0) {
    return null;
  }

  const now = new Date();
  const currentTime = format(now, 'HH:mm');
  
  // Find the current prayer (last prayer that has already occurred)
  let currentPrayer = null;
  
  for (let i = 0; i < prayers.length; i++) {
    if (prayers[i].time <= currentTime) {
      currentPrayer = prayers[i];
    } else {
      break;
    }
  }

  // If no prayer found today yet, return the last prayer from yesterday
  if (!currentPrayer && prayers.length > 0) {
    return prayers[prayers.length - 1];
  }

  return currentPrayer;
};

export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, 'MMMM d, yyyy');
};