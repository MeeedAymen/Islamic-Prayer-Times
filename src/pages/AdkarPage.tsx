import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sun, Moon, Heart } from 'lucide-react';

interface AdkarCategory {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  icon: typeof BookOpen;
}

const categories: AdkarCategory[] = [
  {
    id: 'morning',
    name: 'Morning Adkar',
    arabicName: 'أذكار الصباح',
    description: 'Remembrance and supplications for the morning',
    icon: Sun,
  },
  {
    id: 'evening',
    name: 'Evening Adkar',
    arabicName: 'أذكار المساء',
    description: 'Remembrance and supplications for the evening',
    icon: Moon,
  },
  {
    id: 'general',
    name: 'General Adkar',
    arabicName: 'أذكار عامة',
    description: 'General remembrance and supplications',
    icon: Heart,
  },
];

const AdkarPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <BookOpen className="mr-2" />
        Daily Adkar
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              to={`/adkar/${category.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-4">
                  <Icon className="text-primary-600 dark:text-primary-400" size={24} />
                </div>
                <div>
                  <h2 className="font-medium text-gray-900 dark:text-white">{category.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                </div>
              </div>
              <p className="font-arabic text-xl text-right text-gray-800 dark:text-gray-200">
                {category.arabicName}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdkarPage;