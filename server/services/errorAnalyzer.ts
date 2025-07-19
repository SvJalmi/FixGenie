import { analyzeCodeErrors, generateErrorExplanation } from './openai';
import { generateSpeech } from './murf';
import { storage } from '../storage';
import type { ErrorDetail } from '@shared/schema';

export class ErrorAnalyzer {
  async analyzeCode(code: string, language: string, userId: number) {
    try {
      // Analyze code using OpenAI
      const errors = await analyzeCodeErrors(code, language);
      
      // Store analysis in database
      const analysis = await storage.createErrorAnalysis({
        userId,
        language,
        code,
        errors,
      });

      return analysis;
    } catch (error) {
      throw new Error(`Failed to analyze code: ${error.message}`);
    }
  }

  async generateVoiceExplanation(errorAnalysisId: number, errorIndex: number, voiceId: string, speed: number = 1.0) {
    try {
      const analysis = await storage.getErrorAnalysis(errorAnalysisId);
      if (!analysis) {
        throw new Error('Error analysis not found');
      }

      const error = analysis.errors[errorIndex];
      if (!error) {
        throw new Error('Error not found in analysis');
      }

      // Generate human-friendly explanation
      const explanation = await generateErrorExplanation(error, analysis.language);
      
      // Create voice generation record
      const voiceGeneration = await storage.createVoiceGeneration({
        errorAnalysisId,
        voiceId,
        text: explanation,
      });

      // Generate speech using Murf TTS
      const { audioUrl, duration } = await generateSpeech(explanation, voiceId, {
        speed,
        format: 'mp3',
      });

      // Update voice generation with audio details
      voiceGeneration.audioUrl = audioUrl;
      voiceGeneration.duration = duration;

      return voiceGeneration;
    } catch (error) {
      throw new Error(`Failed to generate voice explanation: ${error.message}`);
    }
  }

  async getLanguageSpecificSuggestions(language: string): Promise<string[]> {
    const suggestions = {
      javascript: [
        "Use semicolons consistently",
        "Declare variables with let/const instead of var",
        "Use strict equality (===) instead of loose equality (==)",
        "Handle async operations properly with async/await",
      ],
      python: [
        "Follow PEP 8 style guidelines",
        "Use list comprehensions for simple iterations",
        "Handle exceptions with try/except blocks",
        "Use f-strings for string formatting",
      ],
      java: [
        "Follow camelCase naming conventions",
        "Use proper exception handling",
        "Implement proper access modifiers",
        "Use generics for type safety",
      ],
      cpp: [
        "Use smart pointers instead of raw pointers",
        "Follow RAII principles",
        "Use const correctness",
        "Avoid memory leaks with proper cleanup",
      ],
    };

    return suggestions[language.toLowerCase()] || [
      "Follow language-specific best practices",
      "Use meaningful variable names",
      "Write clear and concise comments",
      "Handle edge cases properly",
    ];
  }
}

export const errorAnalyzer = new ErrorAnalyzer();
