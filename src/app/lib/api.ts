export interface FarmProfile {
  name: string;
  location: string;
  farmSize: string;
  soilType: string;
  currentCrops: string;
  irrigation: string;
  latitude?: number;
  longitude?: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
}

export const fileToBase64 = async (): Promise<string> => "";

// ===== SMART RESPONSE ENGINE =====

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Context-aware crop advice
export const getCropAdvice = async (
  question: string,
  farmProfile: FarmProfile
): Promise<string> => {
  const q = question.toLowerCase();

  if (q.includes("water") || q.includes("irrigation")) {
    return `For ${farmProfile.currentCrops || "your crops"}, irrigation should depend on soil moisture rather than fixed schedules. 
Check soil at root depth — if dry, irrigate lightly. Overwatering reduces oxygen and harms roots.`;
  }

  if (q.includes("fertilizer") || q.includes("nutrient")) {
    return `Given your ${farmProfile.soilType || "soil"} conditions, prioritize balanced NPK application. 
Avoid excess nitrogen — it promotes leafy growth but weakens plant resilience. Consider split dosing.`;
  }

  if (q.includes("yield") || q.includes("production")) {
    return `Improving yield typically involves optimizing spacing, nutrient timing, and early stress detection. 
Ensure consistent irrigation and monitor leaves for discoloration or curling.`;
  }

  return randomItem([
    "Maintain regular field observation — early detection prevents major losses.",
    "Healthy soil structure is more valuable than aggressive chemical inputs.",
    "Stability in irrigation and nutrients usually beats drastic interventions.",
  ]);
};

// Context-aware disease analysis
export const analyzeDisease = async (
  cropType: string,
  symptoms: string
): Promise<string> => {
  const s = symptoms.toLowerCase();

  if (s.includes("yellow")) {
    return `Yellowing often indicates nutrient imbalance or root stress. 
Inspect lower leaves first. Check nitrogen levels and drainage conditions.`;
  }

  if (s.includes("spots") || s.includes("patch")) {
    return `Leaf spots commonly relate to fungal pathogens. 
Remove affected leaves, reduce moisture retention, and consider preventive fungicide.`;
  }

  if (s.includes("wilting")) {
    return `Wilting with adequate soil moisture suggests vascular or root issues. 
Check for root rot, pests, or stem damage.`;
  }

  return "Symptoms suggest possible stress or early infection. Field inspection recommended for confirmation.";
};

// Weather-based advisory (dynamic feel)
export const getWeatherAdvice = async (
  weatherData: WeatherData,
  farmProfile: FarmProfile
): Promise<string> => {
  if (weatherData.temp > 32) {
    return "High temperature detected. Increase irrigation monitoring and avoid midday fertilizer application.";
  }

  if (weatherData.rainfall > 5) {
    return "Rainfall expected. Delay irrigation and monitor fungal disease risks.";
  }

  return `Conditions appear stable for ${farmProfile.currentCrops || "current crops"}. 
Proceed with routine field activities and pest monitoring.`;
};

// Market guidance (believable demo logic)
export const getMarketPricesAdvice = async (crop: string): Promise<string> => {
  return `Market outlook for ${crop}:

Estimated price band: ₹2100 – ₹2300 per quintal  
Trend: Stable  
Advice: Evaluate storage vs immediate sale depending on liquidity needs.`;
};

// Government schemes (credible & safe)
export const getGovernmentSchemes = async (
  farmProfile: FarmProfile
): Promise<string> => {
  return `Relevant schemes for farmers in ${farmProfile.location || "India"}:

• PM-KISAN – Income support scheme  
• Soil Health Card – Soil nutrient assessment  
• PMFBY – Crop insurance coverage  

Visit nearest agriculture office for eligibility verification.`;
};

// Stable demo weather provider
export const fetchWeatherData = async (): Promise<WeatherData> => {
  return {
    temp: randomItem([26, 28, 31, 34]),
    condition: randomItem(["Clear", "Partly Cloudy", "Cloudy"]),
    humidity: randomItem([55, 65, 72]),
    windSpeed: randomItem([6, 10, 14]),
    rainfall: randomItem([0, 2, 8]),
  };
};

// Stable demo market provider
export const fetchMarketPrices = async (): Promise<any> => {
  return {
    price: randomItem([
      "₹2050 – ₹2250 per quintal",
      "₹2100 – ₹2300 per quintal",
      "₹1980 – ₹2180 per quintal",
    ]),
    trend: randomItem(["Stable", "Slight Increase", "Moderate Demand"]),
  };
};
