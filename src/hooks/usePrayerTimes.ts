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

  // Fetch timezone info and set up live local time
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const fetchTimezoneAndStartClock = async () => {
      if (!latitude || !longitude) return;
      try {
        // 1. Get timezone name from WorldTimeAPI by coordinates
        // We'll use the /api/timezone/Etc/GMT fallback if not found
        let timezoneName = '';
        // Use the geonames.org API to get the timezone name by coordinates (public, no key needed for low usage)
        const geoRes = await fetch(`https://secure.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=demo`);
        const geoData = await geoRes.json();
        timezoneName = geoData.timezoneId || 'Etc/GMT';
        setTimezone(timezoneName);
        // 2. Use local system time instead of worldtimeapi.org
        const now = new Date();
        setLocalTime(now.toISOString());
        // 3. Compute GMT offset from geonames.org response
        if (typeof geoData.gmtOffset === 'number') {
          const offsetHours = geoData.gmtOffset;
          setGmtOffset((offsetHours >= 0 ? 'GMT+' : 'GMT') + offsetHours);
        } else {
          setGmtOffset('');
        }
        // 4. Start live clock
        intervalId = setInterval(() => {
          setLocalTime(prev => {
            // Add 1 second to the previous time
            const dt = new Date(prev);
            dt.setSeconds(dt.getSeconds() + 1);
            return dt.toISOString();
          });
        }, 1000);
      } catch (e) {
        setTimezone('');
        setLocalTime('');
        setGmtOffset('');
      }
    };
    fetchTimezoneAndStartClock();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
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