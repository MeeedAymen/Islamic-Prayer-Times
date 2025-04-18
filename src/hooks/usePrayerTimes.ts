import { useState, useEffect } from 'react';
import { Prayer } from '../types';
import { fetchPrayerTimesByCoordinates, fetchPrayerTimesByCity } from '../api/prayerTimesService';
import { useLocation } from '../context/LocationContext';
import { useNotification } from '../context/NotificationContext';

export const usePrayerTimes = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { city, latitude, longitude } = useLocation();
  const { showNotification } = useNotification();

  // Fetch prayer times
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);

      try {
        let prayerTimes: Prayer[];

        if (latitude && longitude) {
          prayerTimes = await fetchPrayerTimesByCoordinates(latitude, longitude);
        } else if (city) {
          prayerTimes = await fetchPrayerTimesByCity(city);
        } else {
          // Default to Mecca if no location is provided
          prayerTimes = await fetchPrayerTimesByCity('Mecca');
        }

        setPrayers(prayerTimes);
      } catch (err) {
        setError('Failed to fetch prayer times. Please try again later.');
        console.error('Error fetching prayer times:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [city, latitude, longitude]);

  // Set up prayer time notifications
  useEffect(() => {
    if (!prayers.length) return;

    const checkPrayerTimes = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      prayers.forEach(prayer => {
        // Check if it's time for a prayer notification (within 1 minute)
        if (prayer.time === currentTime) {
          showNotification({
            title: `It's time for ${prayer.name} Prayer`,
            message: `${prayer.arabicName} - ${prayer.time}`,
            type: 'prayer',
          });
        }
      });
    };

    // Check prayer times every minute
    const intervalId = setInterval(checkPrayerTimes, 60000);

    // Initial check
    checkPrayerTimes();

    return () => clearInterval(intervalId);
  }, [prayers, showNotification]);

  return { prayers, loading, error };
};