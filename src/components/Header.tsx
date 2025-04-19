import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, MapPin, Bell, BellOff, Book, BookOpen, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import LanguageSelector from './LanguageSelector';
import { useLocation as useGeoLocation } from '../context/LocationContext';
import { useReminders } from '../hooks/useReminders';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();
  const { city } = useGeoLocation();
  const { isActive, toggleReminders } = useReminders();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Heart },
    { path: '/mosque-map', label: 'Mosque Map', icon: MapPin },
    { path: '/quran', label: 'Quran', icon: Book },
    { path: '/adkar', label: 'Adkar', icon: BookOpen },
    { path: '/hadith', label: 'Hadith', icon: BookOpen },
  ];

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <Heart size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Islamic Prayer Times</h1>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <div className="hidden md:flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MapPin size={16} className="mr-1" />
                <span>{city}</span>
              </div>
              
              <button
                onClick={toggleReminders}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isActive ? "Turn off reminders" : "Turn on reminders"}
              >
                {isActive ? (
                  <Bell size={20} className="text-primary-600 dark:text-primary-400" />
                ) : (
                  <BellOff size={20} className="text-gray-400" />
                )}
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={t('common.darkMode')}
              >
                {isDarkMode ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 mt-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} className="mr-2" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-around items-center">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-3 px-2 flex-1 transition-colors ${
                location.pathname === path
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;