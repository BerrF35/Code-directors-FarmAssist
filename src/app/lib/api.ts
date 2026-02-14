const LMSTUDIO_BASE = "https://wage-secretariat-mats-common.trycloudflare.com";

async function askLocalModel(prompt: string, imageBase64?: string): Promise<string> {
  const body: any = {
    model: "qwen/qwen3-vl-4b",
    messages: [
      {
        role: "user",
        content: imageBase64
          ? [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
            ]
          : prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
  };

  const res = await fetch(`${LMSTUDIO_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error("LM Studio error:", t);
    throw new Error("Local model request failed");
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response from model";
}

/* ---------------- Types ---------------- */

export interface FarmProfile {
  name: string;
  location: string;
  farmSize: string;
  soilType: string;
  currentCrops: string;
  irrigation: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
}

/* ---------------- Utilities ---------------- */

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ---------------- Crop Advice ---------------- */

export async function getCropAdvice(
  question: string,
  farmProfile: FarmProfile,
  language: string
)
 {
  const prompt = `
You are an expert agricultural advisor helping an Indian farmer.

Location: ${farmProfile.location}
Language: ${language}

Question: ${question}

Give clear practical advice.
`;
  return askLocalModel(prompt);
}

/* ---------------- Disease Analysis ---------------- */

export async function analyzeDisease(
  cropType: string,
  symptoms: string,
  farmProfile: FarmProfile,
  imageBase64?: string
) {
  const prompt = `
You are a plant disease expert helping an Indian farmer.

Crop: ${cropType}
Symptoms: ${symptoms}
Location: ${farmProfile.location}

If an image is provided, analyze it carefully.

Provide:
- Likely disease
- Confidence
- Treatment
- Prevention
`;

  return askLocalModel(prompt, imageBase64);
}

/* ---------------- Weather Advice ---------------- */

export async function getWeatherAdvice(
  weatherData: WeatherData,
  farmProfile: FarmProfile
) {
  const prompt = `
Weather:
Temp: ${weatherData.temp}
Condition: ${weatherData.condition}

Give farming advice.
`;

  return askLocalModel(prompt);
}
/* ---------------- Market Advice ---------------- */

export async function getMarketPricesAdvice(
  crop: string,
 farmProfile: FarmProfile
) {
  const prompt = `
You are an Indian agricultural market advisor.

Crop: ${crop}
Location: ${farmProfile.location}

Provide realistic pricing guidance in INR.
Give practical selling advice.
`;

  return askLocalModel(prompt);
}
/* ---------------- Government Schemes ---------------- */

export async function getGovernmentSchemes(farmProfile: FarmProfile) {
  const prompt = `
You are an expert on Indian agricultural government schemes.

Farmer Location: ${farmProfile.location}
Farm Size: ${farmProfile.farmSize}

List relevant schemes, subsidies, and benefits.
Keep it practical and realistic.
`;

  return askLocalModel(prompt);
}

/* ---------------- Mock Weather ---------------- */

export async function fetchWeatherData(): Promise<WeatherData> {
  return {
    temp: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    rainfall: 0,
  };
}
