import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CodeSuggestion {
  id: string;
  type: 'completion' | 'refactor' | 'optimization' | 'pattern' | 'documentation';
  title: string;
  description: string;
  originalCode: string;
  suggestedCode: string;
  confidence: number;
  reasoning: string;
  tags: string[];
  estimatedImpact: 'low' | 'medium' | 'high';
}

export interface SmartRefactoring {
  id: string;
  title: string;
  description: string;
  type: 'extract_method' | 'extract_class' | 'inline' | 'rename' | 'move' | 'simplify';
  originalCode: string;
  refactoredCode: string;
  benefits: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  safetyLevel: 'safe' | 'caution' | 'risky';
}

export interface ArchitecturalPattern {
  name: string;
  description: string;
  useCase: string;
  implementation: string;
  pros: string[];
  cons: string[];
  alternatives: string[];
}

export async function generateIntelligentSuggestions(
  code: string,
  language: string,
  context: { fileName?: string; projectType?: string; frameworks?: string[] } = {}
): Promise<CodeSuggestion[]> {
  try {
    const prompt = `As an expert software architect and code reviewer, analyze this ${language} code and provide intelligent suggestions for improvement:

CODE:
${code}

CONTEXT:
- File: ${context.fileName || 'unknown'}
- Project Type: ${context.projectType || 'general'}
- Frameworks: ${context.frameworks?.join(', ') || 'none specified'}

Provide 5-8 diverse suggestions covering:
1. Code completion and auto-generation
2. Refactoring opportunities
3. Performance optimizations
4. Design pattern implementations
5. Documentation improvements
6. Best practice implementations

For each suggestion, provide:
- Clear title and description
- Original and suggested code
- Confidence level (0-100)
- Reasoning and impact assessment
- Relevant tags

Respond in JSON format:
{
  "suggestions": [
    {
      "id": "unique_id",
      "type": "completion|refactor|optimization|pattern|documentation",
      "title": "Suggestion title",
      "description": "Detailed description",
      "originalCode": "code snippet",
      "suggestedCode": "improved code",
      "confidence": 85,
      "reasoning": "why this improvement helps",
      "tags": ["tag1", "tag2"],
      "estimatedImpact": "low|medium|high"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Error generating intelligent suggestions:', error);
    throw new Error('Failed to generate intelligent suggestions');
  }
}

export async function generateSmartRefactoring(
  code: string,
  language: string,
  refactoringGoals: string[]
): Promise<SmartRefactoring[]> {
  try {
    const prompt = `As a refactoring expert, analyze this ${language} code and suggest smart refactoring options focusing on: ${refactoringGoals.join(', ')}

CODE:
${code}

Provide 3-5 refactoring suggestions with:
1. Clear identification of code smells
2. Specific refactoring techniques
3. Step-by-step transformation
4. Benefits and trade-offs
5. Safety assessment

Respond in JSON format:
{
  "refactorings": [
    {
      "id": "unique_id",
      "title": "Refactoring title",
      "description": "What this refactoring does",
      "type": "extract_method|extract_class|inline|rename|move|simplify",
      "originalCode": "original code snippet",
      "refactoredCode": "refactored code",
      "benefits": ["benefit1", "benefit2"],
      "complexity": "simple|moderate|complex",
      "safetyLevel": "safe|caution|risky"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.refactorings || [];
  } catch (error) {
    console.error('Error generating smart refactoring:', error);
    throw new Error('Failed to generate smart refactoring');
  }
}

export async function suggestArchitecturalPatterns(
  codebase: string,
  language: string,
  requirements: string[]
): Promise<ArchitecturalPattern[]> {
  try {
    const prompt = `As a software architecture expert, analyze this ${language} codebase and suggest appropriate architectural patterns:

CODEBASE OVERVIEW:
${codebase}

REQUIREMENTS:
${requirements.join('\n')}

Suggest 3-4 architectural patterns that would improve:
1. Code organization and maintainability
2. Scalability and performance
3. Testability and modularity
4. Design principles adherence

For each pattern, provide:
- Name and description
- Specific use case for this codebase
- Implementation approach
- Pros and cons
- Alternative patterns

Respond in JSON format:
{
  "patterns": [
    {
      "name": "Pattern Name",
      "description": "Pattern description",
      "useCase": "How it applies to this codebase",
      "implementation": "Implementation details",
      "pros": ["pro1", "pro2"],
      "cons": ["con1", "con2"],
      "alternatives": ["alternative1", "alternative2"]
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

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.patterns || [];
  } catch (error) {
    console.error('Error suggesting architectural patterns:', error);
    throw new Error('Failed to suggest architectural patterns');
  }
}

export async function generateFromNaturalLanguage(
  description: string,
  language: string,
  style: string = 'clean'
): Promise<{
  code: string;
  explanation: string;
  alternatives: string[];
  testCases: string;
  documentation: string;
}> {
  try {
    const prompt = `As an expert ${language} developer, generate code from this natural language description:

DESCRIPTION:
${description}

Requirements:
- Write clean, production-ready ${language} code
- Follow ${style} coding style
- Include proper error handling
- Add meaningful comments
- Generate comprehensive test cases
- Provide clear documentation

Respond in JSON format:
{
  "code": "generated code",
  "explanation": "step-by-step explanation",
  "alternatives": ["alternative approach 1", "alternative approach 2"],
  "testCases": "test code",
  "documentation": "usage documentation"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2500
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating code from natural language:', error);
    throw new Error('Failed to generate code from natural language');
  }
}

export async function generateCodeFromImage(
  imageBase64: string,
  language: string
): Promise<{
  detectedElements: string[];
  generatedCode: string;
  explanation: string;
  confidence: number;
}> {
  try {
    const prompt = `Analyze this image and generate ${language} code based on what you see. This could be:
- UI mockups or wireframes
- Flowcharts or diagrams
- Handwritten code or pseudocode
- Architecture diagrams
- Database schemas

Provide:
1. List of detected elements
2. Generated code implementation
3. Explanation of interpretation
4. Confidence level (0-100)

Respond in JSON format:
{
  "detectedElements": ["element1", "element2"],
  "generatedCode": "generated code",
  "explanation": "what was interpreted",
  "confidence": 85
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating code from image:', error);
    throw new Error('Failed to generate code from image');
  }
}