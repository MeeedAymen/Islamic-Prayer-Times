import React from 'react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useLocation } from '../context/LocationContext';
import { useReminders } from '../hooks/useReminders';
import { getRandomAdkar } from '../data/adkar';
import { getRandomQuranVerse } from '../data/quranVerses';

import LocationSelector from '../components/LocationSelector';
import PrayerTimesCard from '../components/PrayerTimesCard';
import ReminderCard from '../components/ReminderCard';

const HomePage: React.FC = () => {
  const { prayers, loading, error, localTime, gmtOffset } = usePrayerTimes();
  const { city } = useLocation();
  const { showRandomAdkar, showRandomQuranVerse } = useReminders();
  
  const [currentAdkar, setCurrentAdkar] = React.useState(getRandomAdkar());
  const [currentVerse, setCurrentVerse] = React.useState(getRandomQuranVerse());

  const handleRefreshAdkar = () => {
    const newAdkar = getRandomAdkar();
    setCurrentAdkar(newAdkar);
    showRandomAdkar();
  };

  const handleRefreshVerse = () => {
    const newVerse = getRandomQuranVerse();
    setCurrentVerse(newVerse);
    showRandomQuranVerse();
  };

  return (
    <div>
      {/* Prominent current time display at the top */}
      {localTime && city && (
        <div className="text-center text-3xl font-bold mb-8 text-primary-700 dark:text-primary-300">
          {localTime.slice(11, 16)} <span className="text-base font-normal">{city} {gmtOffset}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <LocationSelector />
          <PrayerTimesCard prayers={prayers} isLoading={loading} error={error} />
        </div>
        <div className="md:col-span-2">
          <ReminderCard 
            title="Daily Adkar" 
            type="adkar" 
            content={currentAdkar} 
            onRefresh={handleRefreshAdkar} 
          />
          <ReminderCard 
            title="Quran Verse" 
            type="quran" 
            content={currentVerse} 
            onRefresh={handleRefreshVerse} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;