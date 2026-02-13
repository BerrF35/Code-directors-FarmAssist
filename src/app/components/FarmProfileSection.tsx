import { useState, useEffect } from 'react';
import { translations, Language } from '../lib/translations';
import { FarmProfile } from '../lib/api';
import { toast } from 'sonner';

interface FarmProfileSectionProps {
  currentLanguage: Language;
  onBack: () => void;
}

export function FarmProfileSection({
  currentLanguage,
  onBack,
}: FarmProfileSectionProps) {
  const t = translations[currentLanguage];
  const [profile, setProfile] = useState<FarmProfile>({
    name: '',
    location: '',
    farmSize: '',
    soilType: '',
    currentCrops: '',
    irrigation: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('farmProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }

    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfile((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => console.log('Location not available')
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('farmProfile', JSON.stringify(profile));
    toast.success(t.profileSaved);
    setTimeout(() => onBack(), 1500);
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
        <h2 className="text-3xl font-bold text-[#2d5016]">{t.profileTitle}</h2>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800">
              {t.labelName}
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800">
              {t.labelLocation}
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800">
              {t.labelFarmSize}
            </label>
            <input
              type="number"
              step="0.1"
              value={profile.farmSize}
              onChange={(e) =>
                setProfile({ ...profile, farmSize: e.target.value })
              }
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800">
              {t.labelSoilType}
            </label>
            <select
              value={profile.soilType}
              onChange={(e) =>
                setProfile({ ...profile, soilType: e.target.value })
              }
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 transition-all"
            >
              <option value="">{t.selectSoilType}</option>
              <option value="clay">{t.soilClay}</option>
              <option value="loam">{t.soilLoam}</option>
              <option value="sandy">{t.soilSandy}</option>
              <option value="silt">{t.soilSilt}</option>
              <option value="peaty">{t.soilPeaty}</option>
              <option value="chalky">{t.soilChalky}</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800">
              {t.labelCurrentCrops}
            </label>
            <input
              type="text"
              value={profile.currentCrops}
              onChange={(e) =>
                setProfile({ ...profile, currentCrops: e.target.value })
              }
              placeholder="e.g., Rice, Wheat, Cotton"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800">
              {t.labelIrrigation}
            </label>
            <select
              value={profile.irrigation}
              onChange={(e) =>
                setProfile({ ...profile, irrigation: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 transition-all"
            >
              <option value="">{t.selectIrrigation}</option>
              <option value="drip">{t.irrigationDrip}</option>
              <option value="sprinkler">{t.irrigationSprinkler}</option>
              <option value="flood">{t.irrigationFlood}</option>
              <option value="rainfed">{t.irrigationRainfed}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            💾 {t.saveProfileBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
