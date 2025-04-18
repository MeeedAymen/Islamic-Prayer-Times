import React, { createContext, useState, useEffect, useContext } from 'react';
import { LocationContextType } from '../types';

const defaultLocationContext: LocationContextType = {
  city: 'Mecca',
  setCity: () => {},
  latitude: null,
  longitude: null,
  isLocationLoading: false,
  error: null,
  getUserLocation: () => {},
};

const LocationContext = createContext<LocationContextType>(defaultLocationContext);

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [city, setCity] = useState<string>('Mecca');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocationLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLocationLoading(false);
      },
      (error) => {
        setError(`Unable to retrieve your location: ${error.message}`);
        setIsLocationLoading(false);
      }
    );
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
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};