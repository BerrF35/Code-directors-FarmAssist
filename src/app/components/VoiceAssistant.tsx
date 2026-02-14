import { useEffect } from 'react';
import { useVoice } from '../hooks/useVoice';
import { translations, Language } from '../lib/translations';

interface VoiceAssistantProps {
  currentLanguage: Language;
  onVoiceCommand?: (transcript: string) => void;
}

export function VoiceAssistant({
  currentLanguage,
  onVoiceCommand,
}: VoiceAssistantProps) {
  const {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    supported,
  } = useVoice(currentLanguage);

  const t = translations[currentLanguage];

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  /* ✅ CRITICAL FIX */
  useEffect(() => {
    if (!isListening && transcript && onVoiceCommand) {
      onVoiceCommand(transcript);
    }
  }, [isListening]);

  if (!supported) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg mb-8 text-center">
        <p className="text-gray-500">
          Voice recognition is not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg mb-8 text-center">
      <button
        onClick={handleToggle}
        className={`w-32 h-32 rounded-full bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white text-5xl shadow-lg transition-all hover:scale-105 active:scale-95 ${
          isListening ? 'animate-pulse' : ''
        } ${isSpeaking ? 'animate-bounce' : ''}`}
      >
        <span>🎤</span>
      </button>

      <p className="mt-4 text-xl text-gray-600 min-h-8">
        {isListening ? '🎤 Listening...' : t.voiceStatus}
      </p>

      {transcript && (
        <div className="bg-[#fefce8] p-4 rounded-xl mt-4 min-h-16 text-lg text-gray-800">
          {transcript}
        </div>
      )}
    </div>
  );
}
