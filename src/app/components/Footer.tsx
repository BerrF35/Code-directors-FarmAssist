import { translations, Language } from '../lib/translations';

interface FooterProps {
  currentLanguage: Language;
}

export function Footer({ currentLanguage }: FooterProps) {
  const t = translations[currentLanguage];

  return (
    <div className="bg-white p-8 mt-12 text-center border-t-2 border-gray-200">
      <p className="text-gray-600 text-sm max-w-4xl mx-auto leading-relaxed">
        ⚠️ <strong>Disclaimer:</strong> {t.disclaimer}
        <br />
        <br />
        📞 <strong>For Expert Support:</strong> {t.expertSupport}
      </p>
    </div>
  );
}
