import { useState, useEffect } from 'react';
import { Prayer } from '../types';
import { fetchPrayerTimesByCoordinates, fetchPrayerTimesByCity } from '../api/prayerTimesService';
import { useLocation } from '../context/LocationContext';
import { useNotification } from '../context/NotificationContext';

export const usePrayerTimes = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>('');
  const [gmtOffset, setGmtOffset] = useState<string>('');
  const [localTime, setLocalTime] = useState<string>('');
  const { city, latitude, longitude } = useLocation();
  const { showNotification } = useNotification();

  // Fetch timezone info
  useEffect(() => {
    const fetchTimezone = async () => {
      if (!latitude || !longitude) return;
      try {
        const response = await fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${latitude}&longitude=${longitude}`);
        if (!response.ok) throw new Error('Failed to fetch timezone');
        const data = await response.json();
        if (data.timeZone && data.timeZone !== timezone) {
          setTimezone(data.timeZone);
        }
        if (data.dateTime && data.dateTime !== localTime) {
          setLocalTime(data.dateTime);
        }
        // Compute GMT offset from timezone string
        if (data.timeZone && data.dateTime) {
          const dt = new Date(data.dateTime);
          const tz = data.timeZone;
          // Robust GMT offset calculation
          function getGmtOffset(date: Date, timeZone: string): string {
            const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
            const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
            const diff = (tzDate.getTime() - utcDate.getTime()) / 60000;
            const hours = Math.round(diff / 60);
            return `GMT${hours >= 0 ? '+' : ''}${hours}`;
          }
          const offset = getGmtOffset(dt, tz);
          if (offset !== gmtOffset) {
            setGmtOffset(offset);
          }
        } else {
          setGmtOffset('');
        }
      } catch (e) {
        setTimezone('');
        setLocalTime('');
        setGmtOffset('');
      }
    };
    fetchTimezone();
  }, [latitude, longitude]);

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

  return { prayers, loading, error, timezone, gmtOffset, localTime };
};