import { useState, useEffect, useCallback } from 'react';
import { getRandomAdkar } from '../data/adkar';
import { getRandomQuranVerse } from '../data/quranVerses';
import { useNotification } from '../context/NotificationContext';

export const useReminders = (intervalMinutes = 15) => {
  const { showNotification } = useNotification();
  const [isActive, setIsActive] = useState<boolean>(true);

  const showRandomAdkar = useCallback(() => {
    const adkar = getRandomAdkar();
    showNotification({
      title: 'Daily Adkar',
      message: `${adkar.text.length > 50 ? adkar.text.substring(0, 50) + '...' : adkar.text} - ${adkar.translation.substring(0, 60)}...`,
      type: 'adkar',
    });
  }, [showNotification]);

  const showRandomQuranVerse = useCallback(() => {
    const verse = getRandomQuranVerse();
    showNotification({
      title: verse.reference,
      message: `${verse.arabicText.length > 50 ? verse.arabicText.substring(0, 50) + '...' : verse.arabicText} - ${verse.translation.substring(0, 60)}...`,
      type: 'quran',
    });
  }, [showNotification]);

  const toggleReminders = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Function to show both reminders
    const showReminders = () => {
      showRandomAdkar();
      
      // Add a slight delay between notifications
      setTimeout(() => {
        showRandomQuranVerse();
      }, 5000);
    };

    // Initial reminders after 1 minute
    const initialTimeout = setTimeout(() => {
      showReminders();
    }, 60000);

    // Set up the interval for reminders
    const intervalId = setInterval(() => {
      showReminders();
    }, intervalMinutes * 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [isActive, intervalMinutes, showRandomAdkar, showRandomQuranVerse]);

  return { isActive, toggleReminders, showRandomAdkar, showRandomQuranVerse };
};