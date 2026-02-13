import { translations, Language } from '../lib/translations';

interface NavigationCardsProps {
  currentLanguage: Language;
  onNavigate: (section: string) => void;
}

export function NavigationCards({
  currentLanguage,
  onNavigate,
}: NavigationCardsProps) {
  const t = translations[currentLanguage];

  const cards = [
    {
      id: 'profile',
      icon: '👤',
      title: t.navProfile,
      desc: t.navProfileDesc,
    },
    {
      id: 'cropCare',
      icon: '🌾',
      title: t.navCropCare,
      desc: t.navCropCareDesc,
    },
    {
      id: 'disease',
      icon: '🔬',
      title: t.navDisease,
      desc: t.navDiseaseDesc,
    },
    {
      id: 'weather',
      icon: '🌤️',
      title: t.navWeather,
      desc: t.navWeatherDesc,
    },
    {
      id: 'market',
      icon: '💰',
      title: t.navMarket,
      desc: t.navMarketDesc,
    },
    {
      id: 'schemes',
      icon: '📋',
      title: t.navSchemes,
      desc: t.navSchemesDesc,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onNavigate(card.id)}
          className="bg-white rounded-2xl p-8 text-center cursor-pointer transition-all shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-[#2d5016] border-4 border-transparent"
        >
          <div className="text-6xl mb-4">{card.icon}</div>
          <h3 className="text-2xl font-semibold text-[#2d5016] mb-2">
            {card.title}
          </h3>
          <p className="text-gray-600">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
