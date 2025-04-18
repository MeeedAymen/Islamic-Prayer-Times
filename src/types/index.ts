export interface Prayer {
  name: string;
  time: string;
  arabicName: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

export interface City {
  name: string;
  country: string;
  countryCode: string;
}

export interface Adkar {
  id: number;
  text: string;
  translation: string;
  transliteration?: string;
  category: string;
  reference?: string;
}

export interface QuranVerse {
  id: number;
  surah: number;
  ayah: number;
  arabicText: string;
  translation: string;
  transliteration?: string;
  reference: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'prayer' | 'adkar' | 'quran';
  timestamp: Date;
}

export interface LocationContextType {
  city: string;
  setCity: (city: string) => void;
  latitude: number;
  longitude: number;
  isLocationLoading: boolean;
  error: string | null;
  getUserLocation: () => void;
  permissionStatus: PermissionState | null;
  setPermissionStatus: (status: PermissionState) => void;
  setCoordinates: (lat: number, lon: number) => void;
}

export interface NotificationContextType {
  notifications: NotificationItem[];
  showNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  clearNotifications: () => void;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}