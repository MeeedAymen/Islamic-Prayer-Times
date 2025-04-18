import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useTranslation } from 'react-i18next';

interface City {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}


const LocationSelector: React.FC = () => {
  const { t } = useTranslation();
  const [inputCity, setInputCity] = useState<string>('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { city, setCity, getUserLocation, isLocationLoading, error } = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCitySuggestions = async () => {
      if (inputCity.trim().length < 2) {
        setSuggestions([]);
        setSearchError(null);
        return;
      }

      setIsLoading(true);
      setSearchError(null);
      
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputCity)}&format=json&addressdetails=1&limit=5`;
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Islamic-Prayer-Times-App/1.0 (your@email.com)'
          }
        });
        const data = await response.json();
        console.log('Nominatim city suggestions API response:', data);

        if (Array.isArray(data) && data.length > 0) {
          const cities: City[] = data.map((item: any) => ({
            name: item.display_name.split(',')[0],
            country: item.address.country || '',
            countryCode: item.address.country_code ? item.address.country_code.toUpperCase() : '',
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon)
          }));
          setSuggestions(cities);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setSearchError('No cities found');
        }
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
        setSuggestions([]);
        setSearchError('Failed to fetch city suggestions');
        alert('Failed to fetch city suggestions. Check the console for details.');
      } finally {
        setIsLoading(false);
      }
    };


    const debounceTimer = setTimeout(fetchCitySuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    } else if (inputCity.trim().length > 0) {
      setCity(inputCity.trim());
      setInputCity('');
      setSuggestions([]);
      setShowSuggestions(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleSuggestionClick = (suggestion: City) => {
    setCity(`${suggestion.name}, ${suggestion.country}`);
    setInputCity('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleInputFocus = () => {
    if (inputCity.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
        <MapPin size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
        {t('common.location')}
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('common.currentLocation')}:</p>
        <div className="flex items-center">
          <span className="font-medium text-gray-800 dark:text-white">{city}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center mb-3">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            onFocus={handleInputFocus}
            placeholder={t('common.enterCity')}
            autoComplete="off"
            className="w-full px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
          />
          {isLoading ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          )}
          {showSuggestions && (suggestions.length > 0 || searchError) && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              {searchError ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {t(searchError === 'No cities found' ? 'common.noResults' : 'common.error.fetchFailed')}
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.name}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {suggestion.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {suggestion.country}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors duration-200 text-sm font-medium"
        >
          {t('common.update')}
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
          {isLocationLoading ? t('common.detecting') : t('common.useMyLocation')}
        </button>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default LocationSelector;