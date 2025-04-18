import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LocationProvider } from './context/LocationContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

import Header from './components/Header';
import NotificationList from './components/NotificationList';
import HomePage from './pages/HomePage';
import QuranPage from './pages/QuranPage';
import AdkarPage from './pages/AdkarPage';
import HadithPage from './pages/HadithPage';
import SurahPage from './pages/SurahPage';
import AdkarCategoryPage from './pages/AdkarCategoryPage';
import HadithCollectionPage from './pages/HadithCollectionPage';

function App() {
  // Request notification permission on load
  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <ThemeProvider>
      <LocationProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
              <Header />
              
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/quran" element={<QuranPage />} />
                  <Route path="/quran/surah/:id" element={<SurahPage />} />
                  <Route path="/adkar" element={<AdkarPage />} />
                  <Route path="/adkar/:category" element={<AdkarCategoryPage />} />
                  <Route path="/hadith" element={<HadithPage />} />
                  <Route path="/hadith/:collection" element={<HadithCollectionPage />} />
                </Routes>
              </main>
              
              <NotificationList />
              
              <ToastContainer 
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </Router>
        </NotificationProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;