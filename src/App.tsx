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
                  <main className="container mx-auto px-4 py-8">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/quran" element={<QuranPage />} />
                      <Route path="/mosque-map" element={<MosqueMapPage />} />
                      <Route path="/quran/surah/:id" element={<SurahPage />} />
                      <Route path="/adkar" element={<AdkarPage />} />
                      <Route path="/adkar/:category" element={<AdkarCategoryPage />} />
                      <Route path="/hadith" element={<HadithPage />} />
                      <Route path="/hadith/:collection" element={<HadithCollectionPage />} />
                    </Routes>
                  </main>
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