import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const errorAnalyses = pgTable("error_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  language: text("language").notNull(),
  code: text("code").notNull(),
  errors: jsonb("errors").$type<ErrorDetail[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voiceGenerations = pgTable("voice_generations", {
  id: serial("id").primaryKey(),
  errorAnalysisId: integer("error_analysis_id").references(() => errorAnalyses.id).notNull(),
  voiceId: text("voice_id").notNull(),
  text: text("text").notNull(),
  audioUrl: text("audio_url"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertErrorAnalysisSchema = createInsertSchema(errorAnalyses).pick({
  language: true,
  code: true,
  errors: true,
}).extend({
  errors: z.array(z.object({
    type: z.enum(['syntax', 'logical', 'runtime', 'semantic']),
    severity: z.enum(['error', 'warning', 'info']),
    message: z.string(),
    line: z.number(),
    column: z.number().optional(),
    suggestion: z.string().optional(),
    fix: z.string().optional(),
  })),
});

export const insertVoiceGenerationSchema = createInsertSchema(voiceGenerations).pick({
  errorAnalysisId: true,
  voiceId: true,
  text: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertErrorAnalysis = z.infer<typeof insertErrorAnalysisSchema>;
export type ErrorAnalysis = typeof errorAnalyses.$inferSelect;
export type InsertVoiceGeneration = z.infer<typeof insertVoiceGenerationSchema>;
export type VoiceGeneration = typeof voiceGenerations.$inferSelect;

export interface ErrorDetail {
  type: 'syntax' | 'logical' | 'runtime' | 'semantic';
  severity: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column?: number;
  suggestion?: string;
  fix?: string;
}

export interface MurfVoice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  accent?: string;
}
