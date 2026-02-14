import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';

import { Header } from './components/Header';
import { VoiceAssistant } from './components/VoiceAssistant';
import { NavigationCards } from './components/NavigationCards';
import { FarmProfileSection } from './components/FarmProfileSection';
import { CropCareSection } from './components/CropCareSection';
import { DiseaseDetectionSection } from './components/DiseaseDetectionSection';
import { WeatherSection } from './components/WeatherSection';
import { MarketPricesSection } from './components/MarketPricesSection';
import { GovernmentSchemesSection } from './components/GovernmentSchemesSection';
import { Footer } from './components/Footer';

import { Language } from './lib/translations';
import { FarmProfile } from './lib/api';

type Section =
  | 'home'
  | 'profile'
  | 'cropCare'
  | 'disease'
  | 'weather'
  | 'market'
  | 'schemes';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [voiceQuery, setVoiceQuery] = useState('');

  const [farmProfile, setFarmProfile] = useState<FarmProfile>({
    name: '',
    location: '',
    farmSize: '',
    soilType: '',
    currentCrops: '',
    irrigation: '',
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      setCurrentLanguage(savedLang as Language);
    }

    const savedProfile = localStorage.getItem('farmProfile');
    if (savedProfile) {
      setFarmProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };

  const handleNavigate = (section: Section) => {
    setCurrentSection(section);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentSection('home');
    window.scrollTo(0, 0);

    const savedProfile = localStorage.getItem('farmProfile');
    if (savedProfile) {
      setFarmProfile(JSON.parse(savedProfile));
    }
  };

  /* ✅ FIXED VOICE INTENT LOGIC */
  const handleVoiceCommand = (text: string) => {
    if (!text.trim()) return;

    const cmd = text.toLowerCase().trim();

    if (cmd.match(/profile|farm profile|my farm|farm details/)) {
      handleNavigate('profile');
      return;
    }

    if (cmd.match(/crop|crop care|advice|fertilizer|soil/)) {
      handleNavigate('cropCare');
      return;
    }

    if (cmd.match(/disease|pest|infection|leaf|spot|blight/)) {
      handleNavigate('disease');
      return;
    }

    if (cmd.match(/weather|rain|temperature|climate/)) {
      handleNavigate('weather');
      return;
    }

    if (cmd.match(/market|price|sell|mandi/)) {
      handleNavigate('market');
      return;
    }

    if (cmd.match(/scheme|subsidy|government|loan/)) {
      handleNavigate('schemes');
      return;
    }
    setVoiceQuery(text);
    handleNavigate('cropCare');
  };

  return (
    <div className="min-h-screen">
      <Toaster position="bottom-right" richColors />

      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <div className="max-w-7xl mx-auto p-4">
        {currentSection === 'home' && (
          <div className="animate-slideIn">
            <div className="text-center py-12">
              <div className="text-8xl mb-4">🌱</div>

              <VoiceAssistant
                currentLanguage={currentLanguage}
                onVoiceCommand={handleVoiceCommand}
              />
            </div>

            <NavigationCards
              currentLanguage={currentLanguage}
              onNavigate={(section) =>
                handleNavigate(section as Section)
              }
            />
          </div>
        )}

        {currentSection === 'profile' && (
          <FarmProfileSection
            currentLanguage={currentLanguage}
            onBack={handleBack}
          />
        )}

        {currentSection === 'cropCare' && (
          <CropCareSection
            currentLanguage={currentLanguage}
            farmProfile={farmProfile}
            onBack={handleBack}
            initialQuery={voiceQuery}
          />
        )}

        {currentSection === 'disease' && (
          <DiseaseDetectionSection
            currentLanguage={currentLanguage}
            farmProfile={farmProfile}
            onBack={handleBack}
          />
        )}

        {currentSection === 'weather' && (
          <WeatherSection
            currentLanguage={currentLanguage}
            farmProfile={farmProfile}
            onBack={handleBack}
          />
        )}

        {currentSection === 'market' && (
          <MarketPricesSection
            currentLanguage={currentLanguage}
            farmProfile={farmProfile}
            onBack={handleBack}
          />
        )}

        {currentSection === 'schemes' && (
          <GovernmentSchemesSection
            currentLanguage={currentLanguage}
            farmProfile={farmProfile}
            onBack={handleBack}
          />
        )}
      </div>

      <Footer currentLanguage={currentLanguage} />
    </div>
  );
}
