import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const LocationSelector: React.FC = () => {
  const [inputCity, setInputCity] = useState<string>('');
  const { city, setCity, getUserLocation, isLocationLoading, error } = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
        <MapPin size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
        Your Location
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Current location:</p>
        <div className="flex items-center">
          <span className="font-medium text-gray-800 dark:text-white">{city}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter city name"
            className="w-full px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
          />
          <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors duration-200 text-sm font-medium"
        >
          Update
        </button>
      </form>
      
      <div className="flex items-center justify-between">
        <button
          onClick={getUserLocation}
          disabled={isLocationLoading}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {isLocationLoading ? "Detecting..." : "Use my current location"}
        </button>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default LocationSelector;