import React from 'react';
import { useParams } from 'react-router-dom';
import { Book, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Verse {
  number: number;
  text: string;
  translation: string;
}

// This would typically come from an API
const getVerses = (surahId: number): Verse[] => {
  return [
    {
      number: 1,
      text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    },
    // Add more verses
  ];
};

const SurahPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const verses = getVerses(Number(id));

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/quran"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Quran
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Book className="mr-2" />
          Surah Name
        </h1>

        <div className="space-y-8">
          {verses.map((verse) => (
            <div
              key={verse.number}
              className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 dark:text-primary-400 font-medium">
                    {verse.number}
                  </span>
                </div>
              </div>
              <p className="font-arabic text-2xl text-right leading-loose mb-4 text-gray-900 dark:text-white">
                {verse.text}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {verse.translation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurahPage;