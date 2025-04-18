import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { getAdkarByCategory } from '../data/adkar';

const AdkarCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const adkarList = getAdkarByCategory(category || '');

  const categoryTitles: { [key: string]: string } = {
    morning: 'Morning Adkar',
    evening: 'Evening Adkar',
    general: 'General Adkar',
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/adkar"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Adkar
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <BookOpen className="mr-2" />
          {categoryTitles[category || '']}
        </h1>

        <div className="space-y-8">
          {adkarList.map((adkar) => (
            <div
              key={adkar.id}
              className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
            >
              <p className="font-arabic text-2xl text-right leading-loose mb-4 text-gray-900 dark:text-white">
                {adkar.text}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                {adkar.translation}
              </p>
              {adkar.reference && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic text-right">
                  - {adkar.reference}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdkarCategoryPage;