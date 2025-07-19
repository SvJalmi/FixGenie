import OpenAI from "openai";
// Using local CodeError interface to match universalErrorAnalyzer
interface CodeError {
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column: number;
  suggestion: string;
  category: 'syntax' | 'logical' | 'runtime' | 'style' | 'security' | 'logic' | 'algorithm' | 'control-flow' | 'variable' | 'data-structure' | 'concurrent' | 'business';
}

export class LogicalErrorAnalyzer {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  async analyzeLogicalErrors(code: string, language: string): Promise<{
    errors: CodeError[];
    suggestions: string[];
    explanation: string;
    fixedCode?: string;
  }> {
    if (!this.openai) {
      return {
        errors: [],
        suggestions: [`Advanced logical error analysis requires OpenAI integration`],
        explanation: "AI logical analysis not available"
      };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an expert code analyzer specializing in LOGICAL ERROR DETECTION for ${language}. Your primary focus is finding sophisticated logical errors that compilers miss but cause incorrect program behavior.

## PRIORITY LOGICAL ERRORS TO DETECT:

### 1. CONTROL FLOW LOGIC ERRORS:
- Infinite loops without proper exit conditions
- Unreachable code after return/break statements
- Wrong loop conditions (off-by-one errors)
- Incorrect break/continue placement
- Missing return statements in functions
- Dead code after unconditional branches

### 2. CONDITIONAL LOGIC ERRORS:
- Wrong comparison operators (= vs ==, && vs ||)
- Incorrect operator precedence assumptions
- Missing parentheses in complex conditions
- Always-true or always-false conditions
- Negation logic errors (!= vs ==)
- Short-circuit evaluation problems

### 3. VARIABLE LOGIC ERRORS:
- Using uninitialized variables
- Variable shadowing in wrong scope
- Race conditions in concurrent code
- Memory leaks and resource management
- Incorrect variable lifetime management
- Type coercion logical errors

### 4. ALGORITHM LOGIC ERRORS:
- Array bounds violations (accessing index out of range)
- Null pointer dereferences
- Division by zero scenarios
- Mathematical overflow/underflow
- Sorting algorithm errors
- Search algorithm incorrect termination

### 5. DATA STRUCTURE LOGIC ERRORS:
- Modifying collections while iterating
- Stack overflow from recursive calls
- Incorrect data structure operations
- Memory alignment issues
- Buffer overflow vulnerabilities

### 6. CONCURRENT PROGRAMMING ERRORS:
- Deadlocks and race conditions
- Incorrect synchronization
- Shared resource conflicts
- Thread safety violations

### 7. BUSINESS LOGIC ERRORS:
- Incorrect calculations or formulas
- Wrong validation logic
- Inconsistent state management
- Missing edge case handling

Return JSON with this exact structure:
{
  "errors": [{"type": "Specific Error Name", "severity": "error|warning|info", "message": "Clear description of the logical error", "line": number, "column": number, "suggestion": "How to fix the logical error", "category": "logic|algorithm|control-flow|variable|data-structure|concurrent|business"}],
  "suggestions": ["Logical improvement 1", "Logical improvement 2", "Logical improvement 3"],
  "explanation": "Detailed explanation focusing on logical errors and their impact",
  "fixedCode": "Corrected version with logical errors fixed (only if fixes are provided)"
}`
          },
          {
            role: "user",
            content: `Analyze this ${language} code for LOGICAL ERRORS. Focus on finding bugs that would cause incorrect program behavior, infinite loops, wrong calculations, algorithm errors, and control flow problems:\n\`\`\`${language}\n${code}\n\`\`\``
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        errors: Array.isArray(result.errors) ? result.errors.map((error: any) => ({
          type: error.type || 'Logical Error',
          severity: error.severity || 'warning',
          message: error.message || 'Logical error detected',
          line: parseInt(error.line) || 1,
          column: parseInt(error.column) || 1,
          suggestion: error.suggestion || 'Review logic',
          category: error.category || 'logic'
        })) : [],
        suggestions: Array.isArray(result.suggestions) ? result.suggestions : ['Review code logic'],
        explanation: result.explanation || 'Code analyzed for logical errors',
        fixedCode: result.fixedCode
      };

    } catch (error) {
      console.error('OpenAI logical analysis error:', error);
      return {
        errors: [],
        suggestions: ['Error in AI logical analysis'],
        explanation: 'Failed to analyze logical errors'
      };
    }
  }

  // Enhanced pattern-based logical error detection
  detectCommonLogicalErrors(code: string, language: string): CodeError[] {
    const errors: CodeError[] = [];
    const lines = code.split('\n');

    // 1. Infinite loop detection
    lines.forEach((line, index) => {
      if (line.includes('while(true)') || line.includes('while (true)') || 
          line.includes('for(;;)') || line.includes('for (;;)')) {
        if (!code.includes('break') && !code.includes('return')) {
          errors.push({
            type: 'Potential Infinite Loop',
            severity: 'error',
            message: 'Infinite loop without break or return statement',
            line: index + 1,
            column: line.indexOf('while') + 1 || line.indexOf('for') + 1,
            suggestion: 'Add a break condition or return statement to exit the loop',
            category: 'logic'
          });
        }
      }
    });

    // 2. Assignment in condition (common bug)
    lines.forEach((line, index) => {
      const ifPattern = /if\s*\([^)]*=(?!=)[^)]*\)/;
      const whilePattern = /while\s*\([^)]*=(?!=)[^)]*\)/;
      
      if (ifPattern.test(line) || whilePattern.test(line)) {
        errors.push({
          type: 'Assignment in Condition',
          severity: 'error',
          message: 'Using assignment (=) instead of comparison (==) in condition',
          line: index + 1,
          column: line.indexOf('=') + 1,
          suggestion: 'Use == for comparison or === for strict equality',
          category: 'logic'
        });
      }
    });

    // 3. Array bounds violation patterns
    lines.forEach((line, index) => {
      const arrayAccess = /\w+\[\s*\w+\s*\]/g;
      if (arrayAccess.test(line)) {
        if (!line.includes('.length') && !line.includes('< ') && !line.includes('<=')) {
          errors.push({
            type: 'Potential Array Bounds Violation',
            severity: 'warning',
            message: 'Array access without bounds checking',
            line: index + 1,
            column: line.search(arrayAccess) + 1,
            suggestion: 'Add bounds checking before array access',
            category: 'logic'
          });
        }
      }
    });

    // 4. Division by zero detection
    lines.forEach((line, index) => {
      if (line.includes('/') && !line.includes('//') && !line.includes('/*')) {
        const divisionPattern = /\w+\s*\/\s*\w+/;
        if (divisionPattern.test(line)) {
          errors.push({
            type: 'Potential Division by Zero',
            severity: 'warning',
            message: 'Division operation without zero check',
            line: index + 1,
            column: line.indexOf('/') + 1,
            suggestion: 'Add check to ensure divisor is not zero',
            category: 'logic'
          });
        }
      }
    });

    // 5. Uninitialized variable usage (basic detection)
    if (language.toLowerCase() === 'c' || language.toLowerCase() === 'cpp' || language.toLowerCase() === 'c++') {
      lines.forEach((line, index) => {
        const varDeclaration = /\b(int|float|double|char)\s+(\w+)\s*;/;
        const match = varDeclaration.exec(line);
        if (match) {
          const varName = match[2];
          const codeAfter = lines.slice(index + 1).join('\n');
          if (codeAfter.includes(varName) && !codeAfter.includes(`${varName} =`)) {
            errors.push({
              type: 'Uninitialized Variable Usage',
              severity: 'error',
              message: `Variable '${varName}' used before initialization`,
              line: index + 1,
              column: line.indexOf(varName) + 1,
              suggestion: `Initialize '${varName}' before use`,
              category: 'logic'
            });
          }
        }
      });
    }

    // 6. Off-by-one error detection
    lines.forEach((line, index) => {
      const forLoopPattern = /for\s*\(\s*\w+\s*=\s*\d+\s*;\s*\w+\s*<=?\s*\w+\.length\s*;\s*\w+\+\+\s*\)/;
      if (forLoopPattern.test(line) && line.includes('<=')) {
        errors.push({
          type: 'Off-by-One Error',
          severity: 'error',
          message: 'Using <= with array.length causes array bounds violation',
          line: index + 1,
          column: line.indexOf('<=') + 1,
          suggestion: 'Use < instead of <= when iterating with array.length',
          category: 'logic'
        });
      }
    });

    return errors;
  }
}

export const logicalErrorAnalyzer = new LogicalErrorAnalyzer();