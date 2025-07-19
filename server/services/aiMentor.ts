import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  topics: string[];
  prerequisites: string[];
  nextSteps: string[];
}

export interface CodeMentorship {
  personalizedFeedback: string;
  skillAssessment: {
    strengths: string[];
    weaknesses: string[];
    overallLevel: string;
  };
  learningPath: LearningPath;
  practiceExercises: {
    title: string;
    description: string;
    difficulty: string;
    codeTemplate: string;
  }[];
}

export async function generatePersonalizedMentorship(
  code: string,
  language: string,
  userHistory: any[]
): Promise<CodeMentorship> {
  try {
    const prompt = `As an expert programming mentor, analyze this ${language} code and user's coding history to provide personalized mentorship:

CODE:
${code}

USER HISTORY:
${JSON.stringify(userHistory.slice(-10), null, 2)}

Provide comprehensive mentorship including:
1. Detailed personalized feedback on coding style, patterns, and best practices
2. Skill assessment with specific strengths and areas for improvement
3. Customized learning path with specific topics to study
4. 3 practice exercises tailored to their skill level

Respond in JSON format with the following structure:
{
  "personalizedFeedback": "detailed feedback string",
  "skillAssessment": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "overallLevel": "beginner|intermediate|advanced|expert"
  },
  "learningPath": {
    "id": "unique_id",
    "title": "Learning Path Title",
    "description": "Path description",
    "difficulty": "appropriate_level",
    "estimatedTime": "time estimate",
    "topics": ["topic1", "topic2"],
    "prerequisites": ["prereq1", "prereq2"],
    "nextSteps": ["step1", "step2"]
  },
  "practiceExercises": [
    {
      "title": "Exercise Title",
      "description": "Exercise description",
      "difficulty": "level",
      "codeTemplate": "starter code template"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating mentorship:', error);
    throw new Error('Failed to generate personalized mentorship');
  }
}

export async function generateCodeOptimization(
  code: string,
  language: string,
  optimizationGoals: string[]
): Promise<{
  optimizedCode: string;
  improvements: string[];
  performanceGains: string;
  explanation: string;
}> {
  try {
    const prompt = `As a performance optimization expert, optimize this ${language} code focusing on: ${optimizationGoals.join(', ')}

ORIGINAL CODE:
${code}

Provide:
1. Optimized version of the code
2. List of specific improvements made
3. Expected performance gains
4. Detailed explanation of optimizations

Respond in JSON format:
{
  "optimizedCode": "optimized code string",
  "improvements": ["improvement1", "improvement2"],
  "performanceGains": "performance description",
  "explanation": "detailed explanation"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating optimization:', error);
    throw new Error('Failed to generate code optimization');
  }
}

export async function generateSecurityAudit(
  code: string,
  language: string
): Promise<{
  securityScore: number;
  vulnerabilities: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location: string;
    solution: string;
  }[];
  recommendations: string[];
  complianceChecks: {
    standard: string;
    status: 'pass' | 'fail' | 'warning';
    details: string;
  }[];
}> {
  try {
    const prompt = `As a cybersecurity expert, perform a comprehensive security audit of this ${language} code:

CODE:
${code}

Analyze for:
1. Common vulnerabilities (OWASP Top 10, injection attacks, etc.)
2. Security best practices
3. Compliance with security standards
4. Data protection issues

Provide a security score (0-100) and detailed findings in JSON format:
{
  "securityScore": 85,
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "severity": "high",
      "description": "vulnerability description",
      "location": "line number or function",
      "solution": "how to fix"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "complianceChecks": [
    {
      "standard": "OWASP",
      "status": "pass",
      "details": "compliance details"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1800
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating security audit:', error);
    throw new Error('Failed to generate security audit');
  }
}