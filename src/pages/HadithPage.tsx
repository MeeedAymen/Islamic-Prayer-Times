import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface HadithCollection {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  totalHadiths: number;
}

const collections: HadithCollection[] = [
  {
    id: 'bukhari',
    name: 'Sahih al-Bukhari',
    arabicName: 'صحيح البخاري',
    description: 'The most authentic collection of Hadith',
    totalHadiths: 7563,
  },
  {
    id: 'muslim',
    name: 'Sahih Muslim',
    arabicName: 'صحيح مسلم',
    description: 'One of the six major Hadith collections',
    totalHadiths: 7563,
  },
  // Add more collections
];

const HadithPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <BookOpen className="mr-2" />
        Hadith Collections
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/hadith/${collection.id}`}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all"
          >
            <div className="mb-4">
              <h2 className="font-medium text-gray-900 dark:text-white text-lg mb-1">
                {collection.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {collection.description}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {collection.totalHadiths.toLocaleString()} hadiths
              </p>
              <p className="font-arabic text-xl text-gray-800 dark:text-gray-200">
                {collection.arabicName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HadithPage;