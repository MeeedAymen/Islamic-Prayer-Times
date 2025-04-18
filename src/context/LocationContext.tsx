import React, { createContext, useState, useEffect, useContext } from 'react';
import { LocationContextType } from '../types';

const defaultLocationContext: LocationContextType = {
  city: 'Mecca',
  setCity: () => {},
  latitude: 21.422510,  // Mecca's coordinates as fallback
  longitude: 39.826168,
  isLocationLoading: false,
  error: null,
  getUserLocation: () => {},
  permissionStatus: null,
  setPermissionStatus: () => {},
};

const LocationContext = createContext<LocationContextType>(defaultLocationContext);

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [city, setCity] = useState<string>('Mecca');
  const [latitude, setLatitude] = useState<number>(21.422510); // Mecca's latitude as default
  const [longitude, setLongitude] = useState<number>(39.826168); // Mecca's longitude as default
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  const checkPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(result.state);

      result.addEventListener('change', () => {
        setPermissionStatus(result.state);
        if (result.state === 'granted') {
          getUserLocation();
        }
      });

      return result.state;
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      return 'prompt';
    }
  };

  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocationLoading(true);
    setError(null);

    try {
      const permission = await checkPermission();
      
      if (permission === 'denied') {
        setError('Please enable location access in your browser settings to get accurate prayer times for your location.');
        setIsLocationLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setIsLocationLoading(false);
          setError(null);
          // Reverse geocode to get city name
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
            if (response.ok) {
              const data = await response.json();
              // Try to get city/town/village from the response
              const address = data.address;
              const cityName = address.city || address.town || address.village || address.hamlet || address.county || address.state || 'Unknown';
              setCity(cityName);
            } else {
              setCity('Unknown');
            }
          } catch (e) {
            setCity('Unknown');
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setError('Please enable location access to get accurate prayer times for your location.');
          } else {
            setError(`Unable to retrieve your location. Using Mecca's coordinates as fallback.`);
          }
          setIsLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } catch (error) {
      setError('An error occurred while getting your location. Using Mecca\'s coordinates as fallback.');
      setIsLocationLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        city,
        setCity,
        latitude,
        longitude,
        isLocationLoading,
        error,
        getUserLocation,
        permissionStatus,
        setPermissionStatus,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};