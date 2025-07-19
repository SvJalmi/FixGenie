import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { errorAnalyzer } from "./services/errorAnalyzer";
import { getMurfVoices, generateSpeech } from "./services/murf";
import { insertErrorAnalysisSchema } from "@shared/schema";
import { generatePersonalizedMentorship, generateCodeOptimization, generateSecurityAudit } from "./services/aiMentor";
import { collaborationManager } from "./services/realTimeCollaboration";
import { generateIntelligentSuggestions, generateSmartRefactoring, suggestArchitecturalPatterns, generateFromNaturalLanguage, generateCodeFromImage } from "./services/intelligentCodeGen";
import { analyzeCodeMetrics, generatePersonalizedInsights, calculateSkillProgression, generateAchievements, generateVisualizationData } from "./services/analytics";
import { intelligentBackend } from "./services/intelligentBackend";
import { universalErrorAnalyzer, type ErrorAnalysisResult } from "./services/universalErrorAnalyzer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Universal Code Error Analysis - Works with any programming language
  app.post("/api/analyze", async (req, res) => {
    try {
      const { code, language } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ 
          message: "Missing required fields: code and language are required" 
        });
      }
      
      // Use universal error analyzer for comprehensive analysis including logical errors
      const analysis: ErrorAnalysisResult = await universalErrorAnalyzer.analyzeCode(code, language);
      
      // Store analysis for user history (optional)
      const userId = 1; // TODO: Get from session/auth
      try {
        await storage.createErrorAnalysis({
          userId,
          language,
          code,
          errors: analysis.errors.map(e => ({
            type: e.type,
            severity: e.severity,
            message: e.message,
            line: e.line,
            column: e.column,
            suggestion: e.suggestion
          })),
        });
      } catch (storageError) {
        console.log('Failed to store analysis, continuing with response:', storageError);
      }
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze code" 
      });
    }
  });

  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getErrorAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get analysis" 
      });
    }
  });

  app.get("/api/recent-analyses", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const limit = parseInt(req.query.limit as string) || 10;
      
      const analyses = await storage.getUserErrorAnalyses(userId, limit);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get recent analyses" 
      });
    }
  });

  // Voice generation endpoints - Fixed and Simplified
  app.post("/api/generate-voice", async (req, res) => {
    try {
      console.log('Voice generation request received:', req.body);
      
      const schema = z.object({
        text: z.string().min(1, "Text is required"),
        voiceId: z.string().optional().default("voice_us_male"),
        speed: z.number().min(0.5).max(2).optional().default(1.0),
      });
      
      const { text, voiceId, speed } = schema.parse(req.body);
      
      console.log('Generating voice for text:', text.substring(0, 100) + '...');
      
      try {
        // Use Murf TTS with updated API key
        console.log('Attempting Murf TTS generation...');
        const { audioUrl, duration } = await generateSpeech(text, voiceId, {
          speed,
          format: 'mp3',
        });
        
        console.log('Murf TTS successful:', audioUrl);
        
        res.json({
          success: true,
          audioUrl,
          duration,
          provider: 'murf',
          text: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
          voiceId,
          speed
        });
      } catch (murfError) {
        console.error('Murf TTS failed:', murfError);
        res.status(500).json({ 
          success: false,
          message: `Murf TTS failed: ${murfError.message}`,
          error: 'MURF_API_ERROR'
        });
      }
    } catch (validationError) {
      console.error('Voice generation validation error:', validationError);
      res.status(400).json({ 
        success: false,
        message: validationError instanceof Error ? validationError.message : "Invalid request parameters" 
      });
    }
  });

  app.get("/api/voices", async (req, res) => {
    try {
      const voices = await getMurfVoices();
      res.json(voices);
    } catch (error) {
      // Fallback voices when Murf API is not available
      const fallbackVoices = [
        { id: "voice_us_male", name: "US Male", language: "en-US", gender: "male" },
        { id: "voice_us_female", name: "US Female", language: "en-US", gender: "female" },
        { id: "voice_uk_male", name: "UK Male", language: "en-GB", gender: "male" },
        { id: "voice_uk_female", name: "UK Female", language: "en-GB", gender: "female" }
      ];
      res.json(fallbackVoices);
    }
  });

  // NEW: Direct TTS Generation for Error Explanations
  app.post("/api/generate-error-speech", async (req, res) => {
    try {
      const { text, voiceId = "voice_us_male", speed = 1.0 } = req.body;
      
      if (!text) {
        return res.status(400).json({ 
          message: "Missing required field: text" 
        });
      }

      try {
        // Try Murf TTS first
        const { audioUrl, duration } = await generateSpeech(text, voiceId, {
          speed,
          format: 'mp3',
        });
        
        res.json({
          success: true,
          audioUrl,
          duration,
          provider: 'murf',
          text: text
        });
      } catch (murfError) {
        // Fallback: Return text and mock audio response
        console.log('Murf TTS failed, providing fallback response:', murfError.message);
        
        res.json({
          success: true,
          audioUrl: null,
          duration: Math.ceil(text.length / 10), // Estimate: ~10 chars per second
          provider: 'fallback',
          text: text,
          message: 'TTS service temporarily unavailable. Text explanation provided.'
        });
      }
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate speech" 
      });
    }
  });

  app.get("/api/voice-generation/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const voiceGeneration = await storage.getVoiceGeneration(id);
      
      if (!voiceGeneration) {
        return res.status(404).json({ message: "Voice generation not found" });
      }
      
      res.json(voiceGeneration);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get voice generation" 
      });
    }
  });

  // Language suggestions endpoint
  app.get("/api/language-suggestions/:language", async (req, res) => {
    try {
      const language = req.params.language;
      const suggestions = await errorAnalyzer.getLanguageSpecificSuggestions(language);
      res.json({ suggestions });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get suggestions" 
      });
    }
  });

  // Advanced AI Mentor endpoints
  app.post("/api/ai-mentor/mentorship", async (req, res) => {
    try {
      const { code, language } = req.body;
      const userId = 1; // TODO: Get from session/auth
      const userHistory = await storage.getRecentAnalyses(userId, 20);
      
      const mentorship = await generatePersonalizedMentorship(code, language, userHistory);
      res.json(mentorship);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate mentorship" 
      });
    }
  });

  app.post("/api/ai-mentor/optimize", async (req, res) => {
    try {
      const { code, language, goals } = req.body;
      const optimization = await generateCodeOptimization(code, language, goals || ['performance', 'readability']);
      res.json(optimization);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate optimization" 
      });
    }
  });

  app.post("/api/ai-mentor/security-audit", async (req, res) => {
    try {
      const { code, language } = req.body;
      const audit = await generateSecurityAudit(code, language);
      res.json(audit);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate security audit" 
      });
    }
  });

  // Intelligent Code Generation endpoints
  app.post("/api/codegen/suggestions", async (req, res) => {
    try {
      const { code, language, context } = req.body;
      const suggestions = await generateIntelligentSuggestions(code, language, context);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate suggestions" 
      });
    }
  });

  app.post("/api/codegen/refactor", async (req, res) => {
    try {
      const { code, language, goals } = req.body;
      const refactorings = await generateSmartRefactoring(code, language, goals || ['maintainability', 'performance']);
      res.json(refactorings);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate refactoring suggestions" 
      });
    }
  });

  app.post("/api/codegen/patterns", async (req, res) => {
    try {
      const { codebase, language, requirements } = req.body;
      const patterns = await suggestArchitecturalPatterns(codebase, language, requirements);
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to suggest patterns" 
      });
    }
  });

  app.post("/api/codegen/from-text", async (req, res) => {
    try {
      const { description, language, style } = req.body;
      const generated = await generateFromNaturalLanguage(description, language, style);
      res.json(generated);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate code from description" 
      });
    }
  });

  app.post("/api/codegen/from-image", async (req, res) => {
    try {
      const { imageBase64, language } = req.body;
      const generated = await generateCodeFromImage(imageBase64, language);
      res.json(generated);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate code from image" 
      });
    }
  });

  // Analytics and Progress Tracking endpoints
  app.post("/api/analytics/metrics", async (req, res) => {
    try {
      const { code, language } = req.body;
      const metrics = await analyzeCodeMetrics(code, language);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze metrics" 
      });
    }
  });

  app.get("/api/analytics/insights/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId) || 1;
      const userHistory = await storage.getRecentAnalyses(userId, 50);
      
      // Mock metrics data for now
      const codeMetrics: any[] = [];
      const languageUsage = userHistory.reduce((acc: any, h: any) => {
        acc[h.language] = (acc[h.language] || 0) + 1;
        return acc;
      }, {});
      
      const insights = await generatePersonalizedInsights(userHistory, codeMetrics, languageUsage);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate insights" 
      });
    }
  });

  app.get("/api/analytics/progress/:userId/:language", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId) || 1;
      const language = req.params.language;
      const userHistory = await storage.getRecentAnalyses(userId, 100);
      
      const progression = calculateSkillProgression(userHistory, language);
      res.json(progression);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to calculate progression" 
      });
    }
  });

  app.get("/api/analytics/achievements/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId) || 1;
      const userHistory = await storage.getRecentAnalyses(userId, 100);
      
      const achievements = generateAchievements(userHistory, []);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate achievements" 
      });
    }
  });

  app.get("/api/analytics/dashboard/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId) || 1;
      const userHistory = await storage.getRecentAnalyses(userId, 100);
      
      const visualizationData = generateVisualizationData(userHistory, []);
      res.json(visualizationData);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate dashboard data" 
      });
    }
  });

  // Real-time Collaboration endpoints
  app.get("/api/collaboration/sessions", async (req, res) => {
    try {
      const sessions = collaborationManager.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get collaboration sessions" 
      });
    }
  });

  app.get("/api/collaboration/session/:id", async (req, res) => {
    try {
      const sessionId = req.params.id;
      const session = collaborationManager.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get session" 
      });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize real-time collaboration
  collaborationManager.initialize(httpServer);
  return httpServer;
}
