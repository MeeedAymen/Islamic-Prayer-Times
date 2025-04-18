import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

interface Surah {
  id: number;
  name: string;
  arabicName: string;
  versesCount: number;
  revelationType: string;
}

const surahs: Surah[] = [
  { id: 1, name: "Al-Fatihah", arabicName: "الفاتحة", versesCount: 7, revelationType: "Meccan" },
  { id: 2, name: "Al-Baqarah", arabicName: "البقرة", versesCount: 286, revelationType: "Medinan" },
  // Add more surahs as needed
];

const QuranPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Book className="mr-2" />
        The Noble Quran
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah) => (
          <Link
            key={surah.id}
            to={`/quran/surah/${surah.id}`}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-700 dark:text-primary-400 font-medium">
                    {surah.id}
                  </span>
                </div>
                <div>
                  <h2 className="font-medium text-gray-900 dark:text-white">{surah.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{surah.versesCount} verses</p>
                </div>
              </div>
              <p className="font-arabic text-lg text-gray-800 dark:text-gray-200">
                {surah.arabicName}
              </p>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {surah.revelationType}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuranPage;