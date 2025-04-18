import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ChevronLeft } from 'lucide-react';

interface Hadith {
  id: number;
  arabic: string;
  translation: string;
  reference: string;
  chapter: string;
}

// This would typically come from an API
const getHadiths = (collection: string): Hadith[] => {
  return [
    {
      id: 1,
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
      translation: "Actions are but by intentions",
      reference: "Sahih al-Bukhari 1",
      chapter: "Book of Revelation",
    },
    // Add more hadiths
  ];
};

const HadithCollectionPage: React.FC = () => {
  const { collection } = useParams<{ collection: string }>();
  const hadiths = getHadiths(collection || '');

  const collectionTitles: { [key: string]: string } = {
    bukhari: 'Sahih al-Bukhari',
    muslim: 'Sahih Muslim',
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/hadith"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Hadith Collections
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <BookOpen className="mr-2" />
          {collectionTitles[collection || '']}
        </h1>

        <div className="space-y-8">
          {hadiths.map((hadith) => (
            <div
              key={hadith.id}
              className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
            >
              <div className="mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {hadith.chapter}
                </span>
              </div>
              <p className="font-arabic text-2xl text-right leading-loose mb-4 text-gray-900 dark:text-white">
                {hadith.arabic}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                {hadith.translation}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic text-right">
                - {hadith.reference}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HadithCollectionPage;