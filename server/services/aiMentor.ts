import OpenAI from "openai";
import { intelligentBackend } from "./intelligentBackend";

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
    // Use intelligent backend service for reliable mentorship
    return intelligentBackend.generateMentorship(code, language, userHistory);
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
    return intelligentBackend.generateOptimization(code, language, optimizationGoals);
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
    return intelligentBackend.generateSecurityAudit(code, language);
  }
}

// ========== INTELLIGENT FALLBACK FUNCTIONS ==========

function generateIntelligentMentorship(code: string, language: string, userHistory: any[]): CodeMentorship {
  // Analyze code patterns and complexity
  const codeLines = code.split('\n').filter(line => line.trim().length > 0);
  const hasComments = code.includes('//') || code.includes('/*');
  const hasErrorHandling = code.includes('try') || code.includes('catch') || code.includes('throw');
  const hasAsyncCode = code.includes('async') || code.includes('await') || code.includes('Promise');
  const hasFunctions = code.includes('function') || code.includes('=>') || code.includes('def ');
  const hasClasses = code.includes('class ') || code.includes('interface ');
  
  // Determine skill level based on code complexity
  let skillLevel = 'beginner';
  let complexity = 0;
  
  if (hasComments) complexity += 1;
  if (hasErrorHandling) complexity += 2;
  if (hasAsyncCode) complexity += 2;
  if (hasClasses) complexity += 2;
  if (codeLines.length > 20) complexity += 1;
  
  if (complexity >= 6) skillLevel = 'expert';
  else if (complexity >= 4) skillLevel = 'advanced';
  else if (complexity >= 2) skillLevel = 'intermediate';

  // Generate language-specific feedback
  const languageInsights = getLanguageSpecificInsights(language, code);
  
  return {
    personalizedFeedback: `Your ${language} code shows ${skillLevel} level understanding. ${languageInsights.feedback} ${hasComments ? 'Great use of comments for documentation.' : 'Consider adding comments to improve code readability.'} ${hasErrorHandling ? 'Excellent error handling practices.' : 'Adding error handling would make your code more robust.'}`,
    skillAssessment: {
      strengths: languageInsights.strengths,
      weaknesses: languageInsights.weaknesses,
      overallLevel: skillLevel
    },
    learningPath: {
      id: `${language.toLowerCase()}-${skillLevel}-${Date.now()}`,
      title: `${language} ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Development Path`,
      description: `Advance your ${language} skills with focused learning on ${languageInsights.focusAreas.join(', ')}.`,
      difficulty: skillLevel as any,
      estimatedTime: skillLevel === 'beginner' ? '4-6 weeks' : skillLevel === 'intermediate' ? '6-8 weeks' : '8-12 weeks',
      topics: languageInsights.topics,
      prerequisites: languageInsights.prerequisites,
      nextSteps: languageInsights.nextSteps
    },
    practiceExercises: generatePracticeExercises(language, skillLevel)
  };
}

function generateIntelligentOptimization(code: string, language: string, goals: string[]) {
  const codeLines = code.split('\n');
  const improvements = [];
  let optimizedCode = code;
  
  // Analyze common optimization opportunities
  if (goals.includes('performance')) {
    if (code.includes('for (') && code.includes('.length')) {
      improvements.push('Cache array length in loops');
      optimizedCode = optimizedCode.replace(/for\s*\(\s*let\s+(\w+)\s*=\s*0;\s*\1\s*<\s*(\w+)\.length/g, 
        'for (let $1 = 0, len = $2.length; $1 < len');
    }
    
    if (code.includes('document.getElementById') || code.includes('querySelector')) {
      improvements.push('Cache DOM queries');
    }
  }
  
  if (goals.includes('readability')) {
    if (!code.includes('//') && !code.includes('/*')) {
      improvements.push('Add comments for better code documentation');
    }
    
    if (code.includes('var ')) {
      improvements.push('Use const/let instead of var for better scoping');
      optimizedCode = optimizedCode.replace(/var\s+/g, 'const ');
    }
  }
  
  if (goals.includes('maintainability')) {
    if (codeLines.some(line => line.length > 120)) {
      improvements.push('Break long lines for better readability');
    }
    
    if (code.includes('function') && !code.includes('{')) {
      improvements.push('Use arrow functions for concise syntax');
    }
  }
  
  return {
    optimizedCode,
    improvements,
    performanceGains: `Expected ${improvements.length * 10}% improvement in ${goals.join(', ')}`,
    explanation: `Applied ${improvements.length} optimizations focusing on ${goals.join(', ')}. Key improvements include ${improvements.slice(0, 3).join(', ')}.`
  };
}

function generateIntelligentSecurityAudit(code: string, language: string) {
  const vulnerabilities = [];
  const recommendations = [];
  let securityScore = 100;
  
  // Check for common security issues
  if (code.includes('eval(') || code.includes('Function(')) {
    vulnerabilities.push({
      type: 'Code Injection',
      severity: 'critical' as const,
      description: 'Use of eval() or Function() constructor can lead to code injection',
      location: 'Function calls',
      solution: 'Avoid eval() and use safer alternatives like JSON.parse() for data'
    });
    securityScore -= 20;
  }
  
  if (code.includes('innerHTML') && !code.includes('textContent')) {
    vulnerabilities.push({
      type: 'XSS Vulnerability',
      severity: 'high' as const,
      description: 'Direct innerHTML manipulation without sanitization',
      location: 'DOM manipulation',
      solution: 'Use textContent or sanitize HTML content before insertion'
    });
    securityScore -= 15;
  }
  
  if (code.includes('password') && !code.includes('bcrypt') && !code.includes('hash')) {
    vulnerabilities.push({
      type: 'Password Security',
      severity: 'medium' as const,
      description: 'Password handling without proper hashing',
      location: 'Authentication logic',
      solution: 'Use bcrypt or similar library for password hashing'
    });
    securityScore -= 10;
  }
  
  // Generate recommendations
  if (!code.includes('try') && !code.includes('catch')) {
    recommendations.push('Add error handling to prevent information leakage');
  }
  
  if (language.toLowerCase() === 'javascript' && !code.includes('use strict')) {
    recommendations.push('Use strict mode to catch common coding mistakes');
  }
  
  return {
    securityScore: Math.max(0, securityScore),
    vulnerabilities,
    recommendations: recommendations.length ? recommendations : ['Code follows basic security practices', 'Consider adding input validation', 'Implement proper error handling'],
    complianceChecks: [
      {
        standard: 'OWASP',
        status: vulnerabilities.length === 0 ? 'pass' : 'warning' as const,
        details: vulnerabilities.length === 0 ? 'No major OWASP vulnerabilities detected' : `${vulnerabilities.length} potential issues found`
      },
      {
        standard: 'Secure Coding',
        status: securityScore > 80 ? 'pass' : 'warning' as const,
        details: `Security score: ${securityScore}/100`
      }
    ]
  };
}

function getLanguageSpecificInsights(language: string, code: string) {
  const lang = language.toLowerCase();
  
  switch (lang) {
    case 'javascript':
    case 'typescript':
      return {
        feedback: 'Modern JavaScript features are evolving rapidly. Focus on ES6+ syntax and async programming.',
        strengths: ['ES6 Syntax', 'Function Composition', 'DOM Manipulation'],
        weaknesses: ['Error Handling', 'Performance Optimization', 'Security Practices'],
        focusAreas: ['Async/Await', 'Error Boundaries', 'Type Safety'],
        topics: ['Promises & Async/Await', 'Error Handling', 'Modern ES6+ Features', 'TypeScript Basics'],
        prerequisites: ['HTML/CSS Basics', 'Programming Fundamentals'],
        nextSteps: ['React/Vue Framework', 'Node.js Backend', 'Testing Strategies']
      };
    
    case 'python':
      return {
        feedback: 'Python emphasizes readability and simplicity. Focus on Pythonic code patterns and best practices.',
        strengths: ['Clean Syntax', 'Library Usage', 'Data Structures'],
        weaknesses: ['Performance Optimization', 'Memory Management', 'Type Hints'],
        focusAreas: ['Type Hints', 'Context Managers', 'Decorators'],
        topics: ['Type Hints', 'Context Managers', 'Decorators', 'Error Handling'],
        prerequisites: ['Programming Basics', 'Data Structures'],
        nextSteps: ['Web Frameworks', 'Data Science', 'API Development']
      };
    
    case 'java':
      return {
        feedback: 'Java provides strong typing and object-oriented programming. Focus on design patterns and best practices.',
        strengths: ['OOP Concepts', 'Type Safety', 'Memory Management'],
        weaknesses: ['Design Patterns', 'Concurrency', 'Performance Tuning'],
        focusAreas: ['Design Patterns', 'Concurrency', 'Spring Framework'],
        topics: ['Design Patterns', 'Concurrency', 'Exception Handling', 'Spring Basics'],
        prerequisites: ['OOP Fundamentals', 'Programming Basics'],
        nextSteps: ['Spring Framework', 'Microservices', 'Enterprise Development']
      };
    
    default:
      return {
        feedback: `${language} is a powerful language with unique features. Focus on idiomatic patterns and best practices.`,
        strengths: ['Syntax Understanding', 'Basic Concepts', 'Problem Solving'],
        weaknesses: ['Advanced Features', 'Best Practices', 'Performance'],
        focusAreas: ['Language Idioms', 'Best Practices', 'Advanced Features'],
        topics: ['Language Fundamentals', 'Best Practices', 'Advanced Features', 'Error Handling'],
        prerequisites: ['Programming Basics'],
        nextSteps: ['Advanced Concepts', 'Frameworks', 'Real Projects']
      };
  }
}

function generatePracticeExercises(language: string, skillLevel: string) {
  const exercises = {
    beginner: [
      {
        title: 'Variable Declaration and Basic Functions',
        description: 'Practice declaring variables and creating simple functions with proper naming conventions.',
        difficulty: 'beginner',
        codeTemplate: `// TODO: Create a function that takes two parameters and returns their sum\n// Remember to use meaningful variable names\n`
      },
      {
        title: 'Conditional Logic Implementation',
        description: 'Implement conditional statements to handle different scenarios in your code.',
        difficulty: 'beginner',
        codeTemplate: `// TODO: Create a function that checks if a number is positive, negative, or zero\n// Use if-else statements\n`
      }
    ],
    intermediate: [
      {
        title: 'Error Handling Implementation',
        description: 'Add robust error handling to prevent crashes and provide meaningful error messages.',
        difficulty: 'intermediate',
        codeTemplate: `// TODO: Implement try-catch blocks for error handling\n// Handle different types of errors appropriately\n`
      },
      {
        title: 'Data Structure Optimization',
        description: 'Choose and implement appropriate data structures for efficient data management.',
        difficulty: 'intermediate',
        codeTemplate: `// TODO: Implement a data structure that efficiently stores and retrieves data\n// Consider performance implications\n`
      }
    ],
    advanced: [
      {
        title: 'Design Pattern Implementation',
        description: 'Implement design patterns to create maintainable and scalable code architecture.',
        difficulty: 'advanced',
        codeTemplate: `// TODO: Implement a design pattern (Observer, Factory, or Singleton)\n// Focus on clean architecture principles\n`
      },
      {
        title: 'Performance Optimization',
        description: 'Optimize code for better performance while maintaining readability.',
        difficulty: 'advanced',
        codeTemplate: `// TODO: Optimize this code for better performance\n// Consider time and space complexity\n`
      }
    ]
  };
  
  return exercises[skillLevel as keyof typeof exercises] || exercises.beginner;
}