import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CodeMetrics {
  complexity: {
    cyclomatic: number;
    cognitive: number;
    halstead: {
      difficulty: number;
      effort: number;
      volume: number;
    };
  };
  quality: {
    maintainabilityIndex: number;
    technicalDebt: number;
    codeSmells: number;
    duplication: number;
  };
  performance: {
    timeComplexity: string;
    spaceComplexity: string;
    bottlenecks: string[];
    optimizationPotential: number;
  };
  security: {
    vulnerabilityCount: number;
    riskScore: number;
    complianceLevel: string;
  };
}

export interface ProgressTracking {
  userId: string;
  skillLevels: {
    [language: string]: {
      level: number;
      experience: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    unlockedAt: Date;
    category: string;
  }[];
  learningPath: {
    currentPath: string;
    progress: number;
    milestones: {
      title: string;
      completed: boolean;
      completedAt?: Date;
    }[];
  };
  codeQualityTrends: {
    date: Date;
    qualityScore: number;
    errorsFixed: number;
    newConcepts: string[];
  }[];
}

export interface TeamAnalytics {
  teamId: string;
  members: {
    userId: string;
    name: string;
    contributions: number;
    skillLevel: number;
    specializations: string[];
  }[];
  productivity: {
    linesOfCode: number;
    bugsFixed: number;
    featuresDelivered: number;
    codeReviews: number;
  };
  codebaseHealth: {
    overallQuality: number;
    testCoverage: number;
    technicalDebt: number;
    securityScore: number;
  };
  collaboration: {
    pairProgrammingSessions: number;
    knowledgeSharing: number;
    mentoringSessions: number;
  };
}

export async function analyzeCodeMetrics(
  code: string,
  language: string,
  previousMetrics?: CodeMetrics
): Promise<CodeMetrics> {
  try {
    const prompt = `As a software metrics expert, perform comprehensive analysis of this ${language} code:

CODE:
${code}

${previousMetrics ? `PREVIOUS METRICS:\n${JSON.stringify(previousMetrics, null, 2)}` : ''}

Calculate detailed metrics for:
1. Complexity Analysis (Cyclomatic, Cognitive, Halstead)
2. Quality Assessment (Maintainability Index, Technical Debt, Code Smells, Duplication)
3. Performance Analysis (Time/Space Complexity, Bottlenecks, Optimization Potential)
4. Security Assessment (Vulnerability Count, Risk Score, Compliance Level)

Provide specific numeric values and actionable insights.

Respond in JSON format:
{
  "complexity": {
    "cyclomatic": 5,
    "cognitive": 8,
    "halstead": {
      "difficulty": 12.5,
      "effort": 245.7,
      "volume": 89.3
    }
  },
  "quality": {
    "maintainabilityIndex": 78,
    "technicalDebt": 15,
    "codeSmells": 3,
    "duplication": 5
  },
  "performance": {
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "bottlenecks": ["nested loops", "database queries"],
    "optimizationPotential": 75
  },
  "security": {
    "vulnerabilityCount": 2,
    "riskScore": 25,
    "complianceLevel": "medium"
  }
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
    console.error('Error analyzing code metrics:', error);
    throw new Error('Failed to analyze code metrics');
  }
}

export async function generatePersonalizedInsights(
  userHistory: any[],
  codeMetrics: CodeMetrics[],
  languageUsage: { [language: string]: number }
): Promise<{
  insights: string[];
  recommendations: string[];
  skillGaps: string[];
  nextLearningGoals: string[];
  strengthAreas: string[];
}> {
  try {
    const prompt = `As a programming mentor and data analyst, analyze this user's coding journey and provide personalized insights:

USER HISTORY:
${JSON.stringify(userHistory.slice(-20), null, 2)}

CODE METRICS OVER TIME:
${JSON.stringify(codeMetrics.slice(-10), null, 2)}

LANGUAGE USAGE:
${JSON.stringify(languageUsage, null, 2)}

Provide personalized insights including:
1. Key insights about coding patterns and progress
2. Actionable recommendations for improvement
3. Identified skill gaps and areas to focus on
4. Next learning goals based on trajectory
5. Areas where the user shows strength

Respond in JSON format:
{
  "insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "skillGaps": ["gap1", "gap2"],
  "nextLearningGoals": ["goal1", "goal2"],
  "strengthAreas": ["strength1", "strength2"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1800
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating personalized insights:', error);
    throw new Error('Failed to generate personalized insights');
  }
}

export function calculateSkillProgression(
  userHistory: any[],
  language: string
): {
  currentLevel: number;
  experience: number;
  progressToNext: number;
  milestoneAchievements: string[];
} {
  const languageHistory = userHistory.filter(h => h.language === language);
  const totalAnalyses = languageHistory.length;
  const recentQuality = languageHistory.slice(-10).reduce((sum, h) => sum + (h.qualityScore || 50), 0) / Math.min(10, languageHistory.length);
  
  // Calculate level based on experience and quality
  const experience = Math.min(totalAnalyses * 10 + (recentQuality - 50) * 2, 1000);
  const currentLevel = Math.floor(experience / 100) + 1;
  const progressToNext = (experience % 100);
  
  const milestones = [];
  if (totalAnalyses >= 5) milestones.push("First Steps");
  if (totalAnalyses >= 20) milestones.push("Regular Practitioner");
  if (recentQuality >= 80) milestones.push("Quality Coder");
  if (totalAnalyses >= 50) milestones.push("Experienced Developer");
  if (recentQuality >= 90) milestones.push("Expert Level");
  
  return {
    currentLevel,
    experience,
    progressToNext,
    milestoneAchievements: milestones
  };
}

export function generateAchievements(
  userHistory: any[],
  codeMetrics: CodeMetrics[]
): {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}[] {
  const achievements = [];
  const now = new Date();
  
  // Language diversity achievements
  const uniqueLanguages = new Set(userHistory.map(h => h.language)).size;
  if (uniqueLanguages >= 5) {
    achievements.push({
      id: 'polyglot',
      title: 'Polyglot Programmer',
      description: 'Used 5 or more programming languages',
      category: 'diversity',
      rarity: 'rare',
      unlockedAt: now
    });
  }
  
  // Quality achievements
  const recentHighQuality = userHistory.slice(-5).filter(h => h.qualityScore >= 90).length;
  if (recentHighQuality >= 3) {
    achievements.push({
      id: 'quality_master',
      title: 'Quality Master',
      description: 'Achieved 90+ quality score in 3 consecutive analyses',
      category: 'quality',
      rarity: 'epic',
      unlockedAt: now
    });
  }
  
  // Productivity achievements
  if (userHistory.length >= 100) {
    achievements.push({
      id: 'century_club',
      title: 'Century Club',
      description: 'Completed 100 code analyses',
      category: 'productivity',
      rarity: 'legendary',
      unlockedAt: now
    });
  }
  
  // Security achievements
  const securityFocused = codeMetrics.filter(m => m.security.riskScore <= 10).length;
  if (securityFocused >= 10) {
    achievements.push({
      id: 'security_expert',
      title: 'Security Expert',
      description: 'Maintained low security risk in 10+ analyses',
      category: 'security',
      rarity: 'epic',
      unlockedAt: now
    });
  }
  
  return achievements;
}

export function generateVisualizationData(
  userHistory: any[],
  codeMetrics: CodeMetrics[]
): {
  qualityTrend: { date: string; quality: number }[];
  languageDistribution: { language: string; count: number; percentage: number }[];
  complexityEvolution: { date: string; complexity: number }[];
  skillRadar: { skill: string; level: number }[];
  achievementTimeline: { date: string; achievement: string; category: string }[];
} {
  // Quality trend over time
  const qualityTrend = userHistory.slice(-30).map((h, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quality: h.qualityScore || 50
  }));
  
  // Language distribution
  const languageCounts: { [key: string]: number } = {};
  userHistory.forEach(h => {
    languageCounts[h.language] = (languageCounts[h.language] || 0) + 1;
  });
  
  const total = userHistory.length;
  const languageDistribution = Object.entries(languageCounts).map(([language, count]) => ({
    language,
    count,
    percentage: Math.round((count / total) * 100)
  }));
  
  // Complexity evolution
  const complexityEvolution = codeMetrics.slice(-20).map((m, i) => ({
    date: new Date(Date.now() - (19 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    complexity: m.complexity.cyclomatic
  }));
  
  // Skill radar (mock data based on language usage and quality)
  const skillRadar = [
    { skill: 'Code Quality', level: Math.min(100, (userHistory.slice(-10).reduce((sum, h) => sum + (h.qualityScore || 50), 0) / 10)) },
    { skill: 'Security Awareness', level: Math.min(100, 100 - (codeMetrics.slice(-5).reduce((sum, m) => sum + m.security.riskScore, 0) / 5)) },
    { skill: 'Performance Optimization', level: Math.min(100, codeMetrics.slice(-5).reduce((sum, m) => sum + m.performance.optimizationPotential, 0) / 5) },
    { skill: 'Code Maintainability', level: Math.min(100, codeMetrics.slice(-5).reduce((sum, m) => sum + m.quality.maintainabilityIndex, 0) / 5) },
    { skill: 'Language Diversity', level: Math.min(100, Object.keys(languageCounts).length * 10) }
  ];
  
  // Achievement timeline (mock recent achievements)
  const achievementTimeline = [
    { date: new Date().toISOString().split('T')[0], achievement: 'Quality Improver', category: 'quality' },
    { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], achievement: 'Language Explorer', category: 'diversity' }
  ];
  
  return {
    qualityTrend,
    languageDistribution,
    complexityEvolution,
    skillRadar,
    achievementTimeline
  };
}