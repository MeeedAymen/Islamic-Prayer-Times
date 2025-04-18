import React from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { Adkar } from '../types';
import { QuranVerse } from '../types';
import { Hadith } from '../data/hadith';

interface ReminderCardProps {
  title: string;
  type: 'adkar' | 'quran' | 'hadith';
  content: Adkar | QuranVerse | Hadith;
  onRefresh: () => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ title, type, content, onRefresh }) => {
  const isAdkar = type === 'adkar';
  const isQuran = type === 'quran';
  const isHadith = type === 'hadith';
  const adkar = isAdkar ? content as Adkar : null;
  const verse = isQuran ? content as QuranVerse : null;
  const hadith = isHadith ? content as Hadith : null;
  
  const arabicText = isAdkar ? adkar?.text : isQuran ? verse?.arabicText : hadith?.text;
  const translation = isAdkar ? adkar?.translation : isQuran ? verse?.translation : hadith?.translation;
  const reference = isAdkar ? adkar?.reference : isQuran ? verse?.reference : hadith?.reference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <BookOpen size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
          {title}
        </h2>
        <button 
          onClick={onRefresh}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Get new reminder"
        >
          <RefreshCw size={16} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      <div className={`mb-4 p-4 rounded-lg ${
        isAdkar 
          ? 'bg-primary-50 dark:bg-primary-900/10' 
          : isQuran
            ? 'bg-secondary-50 dark:bg-secondary-900/10'
            : 'bg-yellow-50 dark:bg-yellow-900/10'
      }`}>
        <p className="font-arabic text-xl leading-relaxed text-right mb-3 text-gray-900 dark:text-white">
          {arabicText}
        </p>
      </div>
      
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Translation</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {translation}
        </p>
      </div>
      
      {reference && (
        <div className="text-right text-xs text-gray-500 dark:text-gray-400 italic">
          - {reference}
        </div>
      )}
    </div>
  );
};

export default ReminderCard;