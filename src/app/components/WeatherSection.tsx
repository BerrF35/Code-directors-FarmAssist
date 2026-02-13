import { useState, useEffect } from 'react';
import { translations, Language } from '../lib/translations';
import { FarmProfile, getWeatherAdvice, fetchWeatherData, WeatherData } from '../lib/api';
import { toast } from 'sonner';
import { AIResponse } from './AIResponse';
import { LoadingSpinner } from './LoadingSpinner';

interface WeatherSectionProps {
  currentLanguage: Language;
  farmProfile: FarmProfile;
  onBack: () => void;
}

export function WeatherSection({
  currentLanguage,
  farmProfile,
  onBack,
}: WeatherSectionProps) {
  const t = translations[currentLanguage];
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [advice, setAdvice] = useState('');

  const handleGetWeatherAdvice = async () => {
    if (!farmProfile.latitude || !farmProfile.longitude) {
      toast.error('Location not available. Please enable location services.');
      return;
    }

    setLoading(true);
    setAdvice('');

    try {
      // Fetch weather data
      const data = await fetchWeatherData(
        farmProfile.latitude,
        farmProfile.longitude
      );
      setWeatherData(data);

      // Get AI advice based on weather
      const response = await getWeatherAdvice(data, farmProfile);
      setAdvice(response);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to get weather advice'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slideIn">
      <div className="bg-white p-6 rounded-2xl mb-6 shadow-md flex items-center gap-4">
        <button
          onClick={onBack}
          className="bg-[#2d5016] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1a3009] transition-all hover:-translate-x-1"
        >
          ← {t.backBtn}
        </button>
        <h2 className="text-3xl font-bold text-[#2d5016]">
          {t.weatherTitle}
        </h2>
      </div>

      {weatherData && (
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-2xl shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl mb-2">
                {farmProfile.location || 'Your Location'}
              </h3>
              <div className="text-5xl font-bold">{weatherData.temp}°C</div>
              <div className="text-xl">{weatherData.condition}</div>
            </div>
            <div className="text-7xl">
              {weatherData.condition === 'Sunny'
                ? '☀️'
                : weatherData.condition === 'Rainy'
                ? '🌧️'
                : weatherData.condition === 'Cloudy'
                ? '☁️'
                : '⛅'}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white/20 p-4 rounded-xl text-center">
              <div>💧 Humidity</div>
              <div className="text-xl font-bold">{weatherData.humidity}%</div>
            </div>
            <div className="bg-white/20 p-4 rounded-xl text-center">
              <div>💨 Wind</div>
              <div className="text-xl font-bold">{weatherData.windSpeed} km/h</div>
            </div>
            <div className="bg-white/20 p-4 rounded-xl text-center">
              <div>🌧️ Rainfall</div>
              <div className="text-xl font-bold">{weatherData.rainfall}mm</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-md mb-6">
        <button
          onClick={handleGetWeatherAdvice}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🌤️ {t.getWeatherAdvisoryBtn}
        </button>
      </div>

      {loading && <LoadingSpinner message={t.gettingAdvice} />}

      {advice && (
        <AIResponse
          title="🌤️ Weather-Based Advisory"
          content={advice}
        />
      )}
    </div>
  );
}
