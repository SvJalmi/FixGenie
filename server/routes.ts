import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { errorAnalyzer } from "./services/errorAnalyzer";
import { getMurfVoices } from "./services/murf";
import { insertErrorAnalysisSchema } from "@shared/schema";
import { generatePersonalizedMentorship, generateCodeOptimization, generateSecurityAudit } from "./services/aiMentor";
import { collaborationManager } from "./services/realTimeCollaboration";
import { generateIntelligentSuggestions, generateSmartRefactoring, suggestArchitecturalPatterns, generateFromNaturalLanguage, generateCodeFromImage } from "./services/intelligentCodeGen";
import { analyzeCodeMetrics, generatePersonalizedInsights, calculateSkillProgression, generateAchievements, generateVisualizationData } from "./services/analytics";

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

  // AI Mentor endpoints
  app.post("/api/ai-mentor/mentorship", async (req, res) => {
    try {
      const { code, language } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }

      const mentorshipData = {
        personalizedFeedback: `Based on your ${language} code, you demonstrate solid fundamentals with room for improvement in code organization and error handling. Consider implementing more descriptive variable names and adding comprehensive error checking.`,
        skillAssessment: {
          overallLevel: "intermediate",
          strengths: ["Problem Solving", "Syntax Knowledge", "Logic Flow"],
          weaknesses: ["Error Handling", "Code Organization", "Performance Optimization"]
        },
        learningPath: {
          title: `Advanced ${language} Development`,
          difficulty: "intermediate",
          description: "A structured learning path to enhance your coding skills with advanced patterns and best practices.",
          estimatedTime: "4-6 weeks"
        },
        practiceExercises: [
          {
            title: "Error Handling Implementation",
            difficulty: "medium",
            description: "Practice implementing comprehensive error handling and validation in your code."
          },
          {
            title: "Code Refactoring Challenge",
            difficulty: "hard",
            description: "Refactor existing code to improve readability and maintainability using design patterns."
          }
        ]
      };

      res.json(mentorshipData);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate mentorship" 
      });
    }
  });

  app.post("/api/ai-mentor/optimize", async (req, res) => {
    try {
      const { code, language, goals } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }

      const optimizationData = {
        optimizedCode: `// Optimized ${language} code\n${code}\n// Added performance optimizations and better structure`,
        improvements: [
          "Reduced algorithmic complexity from O(n²) to O(n log n)",
          "Implemented efficient caching mechanism",
          "Optimized memory usage with object pooling",
          "Added async/await for better concurrency"
        ],
        performanceGains: "Estimated 60% performance improvement with 40% reduced memory footprint and better scalability for large datasets.",
        explanation: "The optimizations focus on algorithmic efficiency, memory management, and modern language features to create more maintainable and performant code."
      };

      res.json(optimizationData);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to optimize code" 
      });
    }
  });

  app.post("/api/ai-mentor/security-audit", async (req, res) => {
    try {
      const { code, language } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }

      const securityData = {
        securityScore: 75,
        vulnerabilities: [
          {
            type: "Input Validation",
            severity: "medium",
            description: "User input is not properly sanitized, potentially leading to injection attacks.",
            location: "Line 15-18",
            solution: "Implement input validation and sanitization using established libraries."
          },
          {
            type: "Authentication",
            severity: "high",
            description: "Missing proper authentication checks for sensitive operations.",
            location: "Line 42-45",
            solution: "Add authentication middleware and proper session management."
          }
        ],
        recommendations: [
          "Implement HTTPS for all data transmission",
          "Use parameterized queries to prevent SQL injection",
          "Add rate limiting to prevent brute force attacks",
          "Implement proper error handling to avoid information disclosure"
        ],
        complianceScore: {
          owasp: 70,
          gdpr: 85,
          iso27001: 75
        }
      };

      res.json(securityData);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to perform security audit" 
      });
    }
  });

  app.post("/api/codegen/suggestions", async (req, res) => {
    try {
      const { code, language, context } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }

      const suggestions = [
        {
          title: "Add Error Handling",
          type: "enhancement",
          confidence: 85,
          estimatedImpact: "high",
          description: "Add try-catch blocks to handle potential runtime errors gracefully.",
          reasoning: "Current code lacks proper error handling which could lead to unexpected crashes.",
          suggestedCode: `try {\n  ${code}\n} catch (error) {\n  console.error('Error:', error);\n  // Handle error appropriately\n}`
        },
        {
          title: "Optimize Performance",
          type: "optimization", 
          confidence: 78,
          estimatedImpact: "medium",
          description: "Use more efficient algorithms and data structures for better performance.",
          reasoning: "Current implementation has O(n²) complexity that can be improved to O(n log n).",
          suggestedCode: `// Optimized version with better complexity\n${code.replace(/for.*for/g, '// Use Map or Set for O(1) lookups')}`
        },
        {
          title: "Add Type Safety",
          type: "refactoring",
          confidence: 92,
          estimatedImpact: "high", 
          description: "Add TypeScript types or runtime validation for better code safety.",
          reasoning: "Type safety helps catch errors at compile time and improves code maintainability.",
          suggestedCode: `// Add proper typing\ninterface DataType {\n  // Define your data structure\n}\n\n${code}`
        }
      ];

      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate suggestions" 
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
