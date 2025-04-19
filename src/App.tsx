import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { I18nextProvider } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import { LocationProvider } from './context/LocationContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import i18n from './i18n';
import Header from './components/Header';

// Page imports
import HomePage from './pages/HomePage';
import QuranPage from './pages/QuranPage';
import SurahPage from './pages/SurahPage';
import AdkarPage from './pages/AdkarPage';
import AdkarCategoryPage from './pages/AdkarCategoryPage';
import HadithPage from './pages/HadithPage';
import HadithCollectionPage from './pages/HadithCollectionPage';
import MosqueMapPage from './pages/MosqueMapPage';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <ThemeProvider>
          <LocationProvider>
            <NotificationProvider>
              <Router>
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                  <Header />
                  <Routes>
                    <Route path="/mosque-map" element={
                      <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-0 m-0">
                        <MosqueMapPage />
                      </main>
                    } />
                    <Route path="/" element={<main className="container mx-auto px-4 py-8"><HomePage /></main>} />
                    <Route path="/quran" element={<main className="container mx-auto px-4 py-8"><QuranPage /></main>} />
                    <Route path="/quran/surah/:id" element={<main className="container mx-auto px-4 py-8"><SurahPage /></main>} />
                    <Route path="/adkar" element={<main className="container mx-auto px-4 py-8"><AdkarPage /></main>} />
                    <Route path="/adkar/:category" element={<main className="container mx-auto px-4 py-8"><AdkarCategoryPage /></main>} />
                    <Route path="/hadith" element={<main className="container mx-auto px-4 py-8"><HadithPage /></main>} />
                    <Route path="/hadith/:collection" element={<main className="container mx-auto px-4 py-8"><HadithCollectionPage /></main>} />
                  </Routes>
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
      </LanguageProvider>
    </I18nextProvider>
  );
};

export default App;