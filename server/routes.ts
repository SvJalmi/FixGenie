import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { errorAnalyzer } from "./services/errorAnalyzer";
import { getMurfVoices } from "./services/murf";
import { insertErrorAnalysisSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error analysis endpoints
  app.post("/api/analyze", async (req, res) => {
    try {
      const { code, language } = insertErrorAnalysisSchema.parse(req.body);
      const userId = 1; // TODO: Get from session/auth
      
      const analysis = await errorAnalyzer.analyzeCode(code, language, userId);
      res.json(analysis);
    } catch (error) {
      res.status(400).json({ 
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

  // Voice generation endpoints
  app.post("/api/generate-voice", async (req, res) => {
    try {
      const schema = z.object({
        errorAnalysisId: z.number(),
        errorIndex: z.number(),
        voiceId: z.string(),
        speed: z.number().min(0.5).max(2).optional().default(1.0),
      });
      
      const { errorAnalysisId, errorIndex, voiceId, speed } = schema.parse(req.body);
      
      const voiceGeneration = await errorAnalyzer.generateVoiceExplanation(
        errorAnalysisId, 
        errorIndex, 
        voiceId, 
        speed
      );
      
      res.json(voiceGeneration);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to generate voice" 
      });
    }
  });

  app.get("/api/voices", async (req, res) => {
    try {
      const voices = await getMurfVoices();
      res.json(voices);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get voices" 
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

  const httpServer = createServer(app);
  return httpServer;
}
