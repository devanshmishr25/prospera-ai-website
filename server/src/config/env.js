import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 5000,

  clientUrl:
    process.env.CLIENT_URL || "http://localhost:5173",

  mongoUri: process.env.MONGODB_URI,

  openaiApiKey:
    process.env.OPENAI_API_KEY || "",

  textModel:
    process.env.OPENAI_TEXT_MODEL || "gpt-5.5",

  realtimeModel:
    process.env.OPENAI_REALTIME_MODEL ||
    "gpt-realtime-2.1",

  realtimeVoice:
    process.env.OPENAI_REALTIME_VOICE || "marin",
};