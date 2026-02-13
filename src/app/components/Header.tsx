import { translations, Language } from '../lib/translations';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function Header({ currentLanguage, onLanguageChange }: HeaderProps) {
  const t = translations[currentLanguage];

  return (
    <header className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🌾</span>
          <span className="text-2xl font-bold">{t.appName}</span>
        </div>
        <select
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="bg-white/20 border-2 border-white text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-white/30 transition-all"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="bn">বাংলা (Bengali)</option>
          <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
        </select>
      </div>
    </header>
  );
}
