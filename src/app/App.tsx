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

type Section = 'home' | 'profile' | 'cropCare' | 'disease' | 'weather' | 'market' | 'schemes';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [farmProfile, setFarmProfile] = useState<FarmProfile>({
    name: '',
    location: '',
    farmSize: '',
    soilType: '',
    currentCrops: '',
    irrigation: '',
  });

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      setCurrentLanguage(savedLang as Language);
    }

    // Load farm profile
    const savedProfile = localStorage.getItem('farmProfile');
    if (savedProfile) {
      setFarmProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section as Section);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentSection('home');
    window.scrollTo(0, 0);
    
    // Reload farm profile in case it was updated
    const savedProfile = localStorage.getItem('farmProfile');
    if (savedProfile) {
      setFarmProfile(JSON.parse(savedProfile));
    }
  };

  const handleVoiceCommand = (transcript: string) => {
    const lowerCommand = transcript.toLowerCase();

    // Route to appropriate section based on command
    if (lowerCommand.includes('profile') || lowerCommand.includes('प्रोफाइल')) {
      handleNavigate('profile');
    } else if (
      lowerCommand.includes('disease') ||
      lowerCommand.includes('रोग') ||
      lowerCommand.includes('बीमारी')
    ) {
      handleNavigate('disease');
    } else if (lowerCommand.includes('weather') || lowerCommand.includes('मौसम')) {
      handleNavigate('weather');
    } else if (
      lowerCommand.includes('price') ||
      lowerCommand.includes('market') ||
      lowerCommand.includes('मूल्य') ||
      lowerCommand.includes('बाजार')
    ) {
      handleNavigate('market');
    } else if (
      lowerCommand.includes('scheme') ||
      lowerCommand.includes('योजना') ||
      lowerCommand.includes('subsidy')
    ) {
      handleNavigate('schemes');
    } else {
      // General agricultural query - go to crop care
      handleNavigate('cropCare');
    }
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
              <div className="text-8xl mb-4 animate-bounce">🌱</div>
              <h1 className="text-5xl font-bold text-[#2d5016] mb-4">
                {currentLanguage === 'en'
                  ? 'Welcome to FarmAssist'
                  : currentLanguage === 'hi'
                  ? 'फार्मअसिस्ट में आपका स्वागत है'
                  : currentLanguage === 'te'
                  ? 'ఫార్మ్ అసిస్ట్‌కు స్వాగతం'
                  : currentLanguage === 'ta'
                  ? 'ஃபார்ம் அசிஸ்ட்-க்கு வரவேற்கிறோம்'
                  : currentLanguage === 'mr'
                  ? 'फार्म असिस्ट मध्ये आपले स्वागत आहे'
                  : currentLanguage === 'bn'
                  ? 'ফার্ম অ্যাসিস্ট-এ স্বাগতম'
                  : 'ਫਾਰਮ ਅਸਿਸਟ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ'}
              </h1>
              <p className="text-2xl text-gray-600 mb-8">
                {currentLanguage === 'en'
                  ? 'Your AI-powered agricultural companion'
                  : currentLanguage === 'hi'
                  ? 'आपका AI-संचालित कृषि सहायक'
                  : currentLanguage === 'te'
                  ? 'మీ AI-ఆధారిత వ్యవసాయ సహాయకుడు'
                  : currentLanguage === 'ta'
                  ? 'உங்கள் AI-இயங்கும் விவசாய துணைவர்'
                  : currentLanguage === 'mr'
                  ? 'तुमचा AI-चालित कृषी सहाय्यक'
                  : currentLanguage === 'bn'
                  ? 'আপনার AI-চালিত কৃষি সহায়ক'
                  : 'ਤੁਹਾਡਾ AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਸਹਾਇਕ'}
              </p>

              <VoiceAssistant
                currentLanguage={currentLanguage}
                onVoiceCommand={handleVoiceCommand}
              />
            </div>

            <NavigationCards
              currentLanguage={currentLanguage}
              onNavigate={handleNavigate}
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
