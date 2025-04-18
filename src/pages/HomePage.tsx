import React from 'react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useReminders } from '../hooks/useReminders';
import { getRandomAdkar } from '../data/adkar';
import { getRandomQuranVerse } from '../data/quranVerses';

import LocationSelector from '../components/LocationSelector';
import PrayerTimesCard from '../components/PrayerTimesCard';
import ReminderCard from '../components/ReminderCard';

const HomePage: React.FC = () => {
  const { prayers, loading, error } = usePrayerTimes();
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
  );
};

export default HomePage;