import type { MurfVoice } from "@shared/schema";

const MURF_API_KEY = process.env.MURF_API_KEY;
const MURF_API_BASE = "https://api.murf.ai/v1";

export async function generateSpeech(text: string, voiceId: string, options?: {
  speed?: number;
  pitch?: number;
  format?: string;
}): Promise<{ audioUrl: string; duration: number }> {
  if (!MURF_API_KEY) {
    throw new Error("MURF_API_KEY environment variable is not set");
  }

  console.log('Murf API Request:', {
    text: text.substring(0, 100) + '...',
    voiceId,
    options
  });

  try {
    const response = await fetch(`${MURF_API_BASE}/speech/generate`, {
      method: 'POST',
      headers: {
        'api-key': MURF_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voiceId: voiceId,
        format: (options?.format || 'MP3').toUpperCase(),
        modelVersion: "GEN2",
        encodeAsBase64: false,
        style: "conversational",
        sampleRate: 44100,
        channelType: "STEREO"
      }),
    });

    console.log('Murf API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Murf API Error Response:', errorText);
      throw new Error(`Murf API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Murf API Success:', result);
    
    return {
      audioUrl: result.audioFile || result.audio_url || result.url,
      duration: result.audioLengthInSeconds || result.duration || 0,
    };
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error("Failed to generate speech: " + error.message);
  }
}

export async function getMurfVoices(): Promise<MurfVoice[]> {
  if (!MURF_API_KEY) {
    console.log('No Murf API key, returning fallback voices');
    return getFallbackVoices();
  }

  try {
    const response = await fetch(`${MURF_API_BASE}/speech/voices`, {
      headers: {
        'api-key': MURF_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Murf voices API error: ${response.status}`);
      return getFallbackVoices();
    }

    const result = await response.json();
    console.log('Murf voices fetched successfully');
    
    // Transform Murf API response to our format
    const voices = (result.voices || result.data || []).map((voice: any) => ({
      id: voice.voiceId || voice.id,
      name: voice.name,
      language: voice.locale || voice.language,
      gender: voice.gender,
      accent: voice.accent
    }));

    return voices.length > 0 ? voices : getFallbackVoices();
  } catch (error) {
    console.error('Error fetching voices:', error);
    return getFallbackVoices();
  }
}

function getFallbackVoices(): MurfVoice[] {
  return [
    { id: 'natalie', name: 'Natalie (US Female)', language: 'en-US', gender: 'female' },
    { id: 'ryan', name: 'Ryan (US Male)', language: 'en-US', gender: 'male' },
    { id: 'sarah', name: 'Sarah (US Female)', language: 'en-US', gender: 'female' },
    { id: 'kevin', name: 'Kevin (US Male)', language: 'en-US', gender: 'male' },
    { id: 'aditi', name: 'Aditi (IN Female)', language: 'en-IN', gender: 'female' },
    { id: 'ravi', name: 'Ravi (IN Male)', language: 'en-IN', gender: 'male' },
    { id: 'olivia', name: 'Olivia (UK Female)', language: 'en-GB', gender: 'female' },
    { id: 'peter', name: 'Peter (UK Male)', language: 'en-GB', gender: 'male' },
    { id: 'emily', name: 'Emily (AU Female)', language: 'en-AU', gender: 'female' },
    { id: 'daniel', name: 'Daniel (AU Male)', language: 'en-AU', gender: 'male' },
  ];
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
