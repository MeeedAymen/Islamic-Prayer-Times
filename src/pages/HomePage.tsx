import React from 'react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useReminders } from '../hooks/useReminders';
import { getRandomAdkar } from '../data/adkar';
import { getRandomQuranVerse } from '../data/quranVerses';
import { getRandomHadith } from '../data/hadith';

import LocationSelector from '../components/LocationSelector';
import PrayerTimesCard from '../components/PrayerTimesCard';
import ReminderCard from '../components/ReminderCard';

const HomePage: React.FC = () => {
  const { prayers, loading, error, localTime, gmtOffset } = usePrayerTimes();
  const { showRandomAdkar, showRandomQuranVerse } = useReminders();

  // Live updating time state
  const [liveTime, setLiveTime] = React.useState<string | null>(localTime);
  React.useEffect(() => {
    // When localTime changes (location or timezone changes), reset liveTime
    setLiveTime(localTime);
  }, [localTime]);
  React.useEffect(() => {
    if (!liveTime) return;
    const interval = setInterval(() => {
      // Add one minute to the current liveTime
      const dt = new Date(liveTime);
      dt.setMinutes(dt.getMinutes() + 1);
      setLiveTime(dt.toISOString());
    }, 60000);
    return () => clearInterval(interval);
  }, [liveTime]);
  
  const [currentAdkar, setCurrentAdkar] = React.useState(getRandomAdkar());
  const [currentVerse, setCurrentVerse] = React.useState(getRandomQuranVerse());
  const [currentHadith, setCurrentHadith] = React.useState(getRandomHadith());

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

  const handleRefreshHadith = () => {
    const newHadith = getRandomHadith();
    setCurrentHadith(newHadith);
  };

  return (
    <div>
      {/* Prominent current time display at the top */}
      {liveTime && gmtOffset && (
        <div className="text-center text-3xl font-bold mb-8 text-primary-700 dark:text-primary-300">
          {liveTime.slice(11, 16)} <span className="text-base font-normal">{gmtOffset}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <LocationSelector />
          <PrayerTimesCard prayers={prayers} isLoading={loading} error={error} />
        </div>
        <div className="md:col-span-2">
          <ReminderCard 
            title="Quran Verse" 
            type="quran" 
            content={currentVerse} 
            onRefresh={handleRefreshVerse} 
          />
          <ReminderCard 
            title="Daily Adkar" 
            type="adkar" 
            content={currentAdkar} 
            onRefresh={handleRefreshAdkar} 
          />
          <ReminderCard 
            title="Daily Hadith" 
            type="hadith" 
            content={currentHadith} 
            onRefresh={handleRefreshHadith} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;