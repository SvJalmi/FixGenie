import { users, errorAnalyses, voiceGenerations, type User, type InsertUser, type ErrorAnalysis, type InsertErrorAnalysis, type VoiceGeneration, type InsertVoiceGeneration } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createErrorAnalysis(analysis: InsertErrorAnalysis & { userId: number }): Promise<ErrorAnalysis>;
  getErrorAnalysis(id: number): Promise<ErrorAnalysis | undefined>;
  getUserErrorAnalyses(userId: number, limit?: number): Promise<ErrorAnalysis[]>;
  getRecentAnalyses(userId: number, limit?: number): Promise<ErrorAnalysis[]>;
  
  createVoiceGeneration(generation: InsertVoiceGeneration): Promise<VoiceGeneration>;
  getVoiceGeneration(id: number): Promise<VoiceGeneration | undefined>;
  getErrorVoiceGenerations(errorAnalysisId: number): Promise<VoiceGeneration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private errorAnalyses: Map<number, ErrorAnalysis>;
  private voiceGenerations: Map<number, VoiceGeneration>;
  private currentUserId: number;
  private currentErrorAnalysisId: number;
  private currentVoiceGenerationId: number;

  constructor() {
    this.users = new Map();
    this.errorAnalyses = new Map();
    this.voiceGenerations = new Map();
    this.currentUserId = 1;
    this.currentErrorAnalysisId = 1;
    this.currentVoiceGenerationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createErrorAnalysis(analysis: InsertErrorAnalysis & { userId: number }): Promise<ErrorAnalysis> {
    const id = this.currentErrorAnalysisId++;
    const errorAnalysis: ErrorAnalysis = {
      ...analysis,
      id,
      createdAt: new Date(),
    };
    this.errorAnalyses.set(id, errorAnalysis);
    return errorAnalysis;
  }

  async getErrorAnalysis(id: number): Promise<ErrorAnalysis | undefined> {
    return this.errorAnalyses.get(id);
  }

  async getUserErrorAnalyses(userId: number, limit: number = 10): Promise<ErrorAnalysis[]> {
    return Array.from(this.errorAnalyses.values())
      .filter(analysis => analysis.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getRecentAnalyses(userId: number, limit: number = 50): Promise<ErrorAnalysis[]> {
    return this.getUserErrorAnalyses(userId, limit);
  }

  async createVoiceGeneration(generation: InsertVoiceGeneration): Promise<VoiceGeneration> {
    const id = this.currentVoiceGenerationId++;
    const voiceGeneration: VoiceGeneration = {
      id,
      errorAnalysisId: generation.errorAnalysisId!,
      voiceId: generation.voiceId,
      text: generation.text,
      audioUrl: null,
      duration: null,
      createdAt: new Date(),
    };
    this.voiceGenerations.set(id, voiceGeneration);
    return voiceGeneration;
  }

  async getVoiceGeneration(id: number): Promise<VoiceGeneration | undefined> {
    return this.voiceGenerations.get(id);
  }

  async getErrorVoiceGenerations(errorAnalysisId: number): Promise<VoiceGeneration[]> {
    return Array.from(this.voiceGenerations.values())
      .filter(generation => generation.errorAnalysisId === errorAnalysisId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const storage = new MemStorage();
