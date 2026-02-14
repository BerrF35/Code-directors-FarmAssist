import { useState } from 'react';
import { translations, Language } from '../lib/translations';
import { FarmProfile, getCropAdvice } from '../lib/api';
import { toast } from 'sonner';
import { AIResponse } from './AIResponse';
import { LoadingSpinner } from './LoadingSpinner';

interface CropCareSectionProps {
  currentLanguage: Language;
  farmProfile: FarmProfile;
  onBack: () => void;
  initialQuery?: string;
}

export function CropCareSection({
  currentLanguage,
  farmProfile,
  onBack,
  initialQuery,
}: CropCareSectionProps) {
  const t = translations[currentLanguage];
  const [question, setQuestion] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState('');

  const handleGetAdvice = async () => {
    if (!question.trim()) {
      toast.error('Please enter your question');
      return;
    }

    setLoading(true);
    setAdvice('');

    try {
      const response = await getCropAdvice(question, farmProfile);
      setAdvice(response);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to get advice'
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
          {t.cropCareTitle}
        </h2>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md mb-6">
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-800">
            {t.labelCropQuestion}
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., When should I water my rice crop? What fertilizer is best for wheat?"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 transition-all resize-y min-h-32"
          />
        </div>
        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🌱 {t.getCropAdviceBtn}
        </button>
      </div>

      {loading && <LoadingSpinner message={t.gettingAdvice} />}

      {advice && (
        <AIResponse
          title="🌱 Crop Care Advice"
          content={advice}
        />
      )}
    </div>
  );
}
