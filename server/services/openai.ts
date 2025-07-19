import OpenAI from "openai";
import type { ErrorDetail } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function analyzeCodeErrors(code: string, language: string): Promise<ErrorDetail[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert code analyzer specializing in ${language}. Analyze the provided code and identify all errors, warnings, and potential issues. Return a JSON array of error objects with the following structure:
          {
            "type": "syntax|logical|runtime|semantic",
            "severity": "error|warning|info", 
            "message": "Clear description of the issue",
            "line": number,
            "column": number (optional),
            "suggestion": "Explanation of why this is an issue",
            "fix": "Exact code fix or improvement"
          }
          
          Focus on:
          - Syntax errors (missing semicolons, brackets, etc.)
          - Type errors and undefined variables
          - Logic issues and potential bugs
          - Performance improvements
          - Best practices violations
          - Security vulnerabilities
          
          Provide specific, actionable solutions for each issue.`
        },
        {
          role: "user",
          content: `Language: ${language}\n\nCode:\n${code}`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.errors || [];
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw new Error("Failed to analyze code: " + error.message);
  }
}

export async function generateErrorExplanation(error: ErrorDetail, language: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a helpful programming tutor. Explain programming errors in clear, beginner-friendly language suitable for text-to-speech conversion. Use simple vocabulary and avoid special characters or symbols that might not pronounce well. Keep explanations concise but informative.`
        },
        {
          role: "user",
          content: `Explain this ${language} error for voice narration:
          Type: ${error.type}
          Message: ${error.message}
          Line: ${error.line}
          ${error.suggestion ? `Suggestion: ${error.suggestion}` : ''}
          ${error.fix ? `Fix: ${error.fix}` : ''}`
        },
      ],
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating explanation:', error);
    throw new Error("Failed to generate explanation: " + error.message);
  }
}
