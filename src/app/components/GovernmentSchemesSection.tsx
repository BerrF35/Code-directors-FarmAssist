import { useState } from 'react';
import { translations, Language } from '../lib/translations';
import { FarmProfile, getGovernmentSchemes } from '../lib/api';
import { toast } from 'sonner';
import { AIResponse } from './AIResponse';
import { LoadingSpinner } from './LoadingSpinner';

interface GovernmentSchemesSectionProps {
  currentLanguage: Language;
  farmProfile: FarmProfile;
  onBack: () => void;
}

export function GovernmentSchemesSection({
  currentLanguage,
  farmProfile,
  onBack,
}: GovernmentSchemesSectionProps) {
  const t = translations[currentLanguage];
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState('');

  const handleGetSchemes = async () => {
    setLoading(true);
    setSchemes('');

    try {
      const response = await getGovernmentSchemes(farmProfile);
      setSchemes(response);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to get government schemes'
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
          {t.schemesTitle}
        </h2>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md mb-6">
        <button
          onClick={handleGetSchemes}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📋 {t.findSchemesBtn}
        </button>
      </div>

      {loading && <LoadingSpinner message={t.findingSchemes} />}

      {schemes && (
        <AIResponse
          title="📋 Government Schemes"
          content={schemes}
        />
      )}
    </div>
  );
}
