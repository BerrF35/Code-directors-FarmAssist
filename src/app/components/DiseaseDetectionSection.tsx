import { useState } from 'react';
import { translations, Language } from '../lib/translations';
import { FarmProfile, analyzeDisease, fileToBase64 } from '../lib/api';
import { toast } from 'sonner';
import { AIResponse } from './AIResponse';
import { LoadingSpinner } from './LoadingSpinner';

interface DiseaseDetectionSectionProps {
  currentLanguage: Language;
  farmProfile: FarmProfile;
  onBack: () => void;
}

export function DiseaseDetectionSection({
  currentLanguage,
  farmProfile,
  onBack,
}: DiseaseDetectionSectionProps) {
  const t = translations[currentLanguage];
  const [cropType, setCropType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!cropType && !symptoms) {
      toast.error('Please provide crop type or symptoms');
      return;
    }

    setLoading(true);
    setDiagnosis('');

    try {
      let imageBase64: string | undefined;
      if (image) {
        imageBase64 = await fileToBase64(image);
      }

      const response = await analyzeDisease(
        cropType,
        symptoms,
        farmProfile,
        imageBase64
      );
      setDiagnosis(response);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to analyze disease'
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
          {t.diseaseTitle}
        </h2>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md mb-6">
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-800">
            {t.labelCropType}
          </label>
          <input
            type="text"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            placeholder="e.g., Rice, Wheat, Tomato"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-800">
            {t.labelSymptoms}
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="E.g., Yellow spots on leaves, wilting, brown patches"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 transition-all resize-y min-h-32"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-800">
            Upload Crop Image
          </label>
          <div
            onClick={() => document.getElementById('diseaseImage')?.click()}
            className="border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer transition-all hover:border-[#2d5016] hover:bg-white bg-[#fefce8]"
          >
            <div className="text-6xl text-[#2d5016] mb-4">📷</div>
            <p className="text-xl text-gray-600">{t.uploadText}</p>
            <input
              type="file"
              id="diseaseImage"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full rounded-xl mt-4 shadow-md"
            />
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔬 {t.analyzeDiseaseBtn}
        </button>
      </div>

      {loading && <LoadingSpinner message={t.analyzing} />}

      {diagnosis && (
        <AIResponse
          title="🔬 Disease Analysis"
          content={diagnosis}
        />
      )}
    </div>
  );
}
