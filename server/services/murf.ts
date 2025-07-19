import type { MurfVoice } from "@shared/schema";

const MURF_API_KEY = process.env.MURF_API_KEY || process.env.MURF_API_KEY_ENV_VAR || "default_key";
const MURF_API_BASE = "https://api.murf.ai/v1";

export async function generateSpeech(text: string, voiceId: string, options?: {
  speed?: number;
  pitch?: number;
  format?: string;
}): Promise<{ audioUrl: string; duration: number }> {
  try {
    const response = await fetch(`${MURF_API_BASE}/speech/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MURF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_id: voiceId,
        speed: options?.speed || 1.0,
        pitch: options?.pitch || 0,
        format: options?.format || 'mp3',
        quality: 'high',
      }),
    });

    if (!response.ok) {
      throw new Error(`Murf API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      audioUrl: result.audio_url,
      duration: result.duration || 0,
    };
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error("Failed to generate speech: " + error.message);
  }
}

export async function getMurfVoices(): Promise<MurfVoice[]> {
  try {
    const response = await fetch(`${MURF_API_BASE}/voices`, {
      headers: {
        'Authorization': `Bearer ${MURF_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Murf API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.voices || [];
  } catch (error) {
    console.error('Error fetching voices:', error);
    // Return a fallback list of common voices
    return [
      { id: 'voice_us_male', name: 'US Male', language: 'en-US', gender: 'male' },
      { id: 'voice_us_female', name: 'US Female', language: 'en-US', gender: 'female' },
      { id: 'voice_uk_male', name: 'UK Male', language: 'en-UK', gender: 'male' },
      { id: 'voice_uk_female', name: 'UK Female', language: 'en-UK', gender: 'female' },
      { id: 'voice_au_male', name: 'AU Male', language: 'en-AU', gender: 'male' },
      { id: 'voice_au_female', name: 'AU Female', language: 'en-AU', gender: 'female' },
      { id: 'voice_ca_male', name: 'CA Male', language: 'en-CA', gender: 'male' },
      { id: 'voice_ca_female', name: 'CA Female', language: 'en-CA', gender: 'female' },
      { id: 'voice_in_male', name: 'IN Male', language: 'en-IN', gender: 'male' },
      { id: 'voice_in_female', name: 'IN Female', language: 'en-IN', gender: 'female' },
    ];
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await fetch(`${MURF_API_BASE}/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MURF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        target_language: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Murf API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.translated_text || text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return original text if translation fails
  }
}
