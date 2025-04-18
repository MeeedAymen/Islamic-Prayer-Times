import axios from 'axios';
import { PrayerTimes, Prayer } from '../types';

// Base URL for the prayer times API
const API_URL = 'https://api.aladhan.com/v1';

interface AladhanAPIResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      [key: string]: string;
    };
    date: {
      readable: string;
      timestamp: string;
    };
  };
}

// Fetch prayer times by coordinates
export const fetchPrayerTimesByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<Prayer[]> => {
  try {
    const response = await axios.get<AladhanAPIResponse>(`${API_URL}/timings`, {
      params: {
        latitude,
        longitude,
        method: 2, // Islamic Society of North America (ISNA)
      },
    });

    if (response.data.code !== 200) {
      throw new Error(`API Error: ${response.data.status}`);
    }

    const data = response.data.data.timings;
    const prayerTimes: Prayer[] = [
      { name: 'Fajr', time: data.Fajr.split(' ')[0], arabicName: 'الفجر' },
      { name: 'Sunrise', time: data.Sunrise.split(' ')[0], arabicName: 'الشروق' },
      { name: 'Dhuhr', time: data.Dhuhr.split(' ')[0], arabicName: 'الظهر' },
      { name: 'Asr', time: data.Asr.split(' ')[0], arabicName: 'العصر' },
      { name: 'Maghrib', time: data.Maghrib.split(' ')[0], arabicName: 'المغرب' },
      { name: 'Isha', time: data.Isha.split(' ')[0], arabicName: 'العشاء' },
    ];

    return prayerTimes;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

// Fetch prayer times by city name
export const fetchPrayerTimesByCity = async (city: string): Promise<Prayer[]> => {
  try {
    const response = await axios.get<AladhanAPIResponse>(`${API_URL}/timingsByCity`, {
      params: {
        city,
        country: '', // The API will try to infer the country
        method: 2, // Islamic Society of North America (ISNA)
      },
    });

    if (response.data.code !== 200) {
      throw new Error(`API Error: ${response.data.status}`);
    }

    const data = response.data.data.timings;
    const prayerTimes: Prayer[] = [
      { name: 'Fajr', time: data.Fajr.split(' ')[0], arabicName: 'الفجر' },
      { name: 'Sunrise', time: data.Sunrise.split(' ')[0], arabicName: 'الشروق' },
      { name: 'Dhuhr', time: data.Dhuhr.split(' ')[0], arabicName: 'الظهر' },
      { name: 'Asr', time: data.Asr.split(' ')[0], arabicName: 'العصر' },
      { name: 'Maghrib', time: data.Maghrib.split(' ')[0], arabicName: 'المغرب' },
      { name: 'Isha', time: data.Isha.split(' ')[0], arabicName: 'العشاء' },
    ];

    return prayerTimes;
  } catch (error) {
    console.error('Error fetching prayer times by city:', error);
    throw error;
  }
};

// Fetch prayer times for the next 7 days by coordinates
export const fetchWeeklyPrayerTimes = async (
  latitude: number,
  longitude: number
): Promise<PrayerTimes[]> => {
  try {
    const response = await axios.get<{
      code: number;
      status: string;
      data: Array<{
        timings: {
          Fajr: string;
          Sunrise: string;
          Dhuhr: string;
          Asr: string;
          Maghrib: string;
          Isha: string;
        };
        date: {
          readable: string;
          timestamp: string;
        };
      }>;
    }>(`${API_URL}/calendar`, {
      params: {
        latitude,
        longitude,
        method: 2, // Islamic Society of North America (ISNA)
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
    });

    if (response.data.code !== 200) {
      throw new Error(`API Error: ${response.data.status}`);
    }

    const startDay = new Date().getDate() - 1;
    const endDay = startDay + 7;

    return response.data.data
      .slice(startDay, endDay)
      .map((day) => ({
        fajr: day.timings.Fajr.split(' ')[0],
        sunrise: day.timings.Sunrise.split(' ')[0],
        dhuhr: day.timings.Dhuhr.split(' ')[0],
        asr: day.timings.Asr.split(' ')[0],
        maghrib: day.timings.Maghrib.split(' ')[0],
        isha: day.timings.Isha.split(' ')[0],
        date: day.date.readable,
      }));
  } catch (error) {
    console.error('Error fetching weekly prayer times:', error);
    throw error;
  }
};