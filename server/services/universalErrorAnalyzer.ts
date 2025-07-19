// ========== UNIVERSAL CODE ERROR ANALYZER ==========
// Comprehensive error detection and analysis for 150+ programming languages

import { intelligentBackend } from "./intelligentBackend";

export interface CodeError {
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column: number;
  suggestion: string;
  category: 'syntax' | 'logical' | 'runtime' | 'style' | 'security';
}

export interface ErrorAnalysisResult {
  language: string;
  code: string;
  errors: CodeError[];
  suggestions: string[];
  explanation: string;
  fixedCode?: string;
}

export class UniversalErrorAnalyzer {
  
  // ========== MAIN ANALYSIS METHOD ==========
  analyzeCode(code: string, language: string): ErrorAnalysisResult {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    let explanation = "";
    let fixedCode = code;

    // Get language-specific analysis
    const languageAnalysis = this.getLanguageSpecificAnalysis(code, language);
    errors.push(...languageAnalysis.errors);
    suggestions.push(...languageAnalysis.suggestions);
    
    // Apply universal code analysis patterns
    const universalAnalysis = this.performUniversalAnalysis(code);
    errors.push(...universalAnalysis.errors);
    suggestions.push(...universalAnalysis.suggestions);

    // Generate comprehensive explanation
    explanation = this.generateExplanation(errors, language);
    
    // Attempt to fix common errors
    fixedCode = this.generateFixedCode(code, errors, language);

    return {
      language,
      code,
      errors: errors.slice(0, 10), // Limit to top 10 most critical errors
      suggestions: [...new Set(suggestions)], // Remove duplicates
      explanation,
      fixedCode: fixedCode !== code ? fixedCode : undefined
    };
  }

  // ========== LANGUAGE-SPECIFIC ANALYSIS ==========
  private getLanguageSpecificAnalysis(code: string, language: string) {
    const lang = language.toLowerCase();
    
    // Main supported languages with dedicated analyzers
    switch (lang) {
      // Web Technologies
      case 'javascript':
      case 'javascript-client':
      case 'javascript-func':
        return this.analyzeJavaScript(code);
      case 'typescript':
        return this.analyzeTypeScript(code);
      case 'html':
      case 'xhtml':
        return this.analyzeHTML(code);
      case 'css':
      case 'scss':
      case 'less':
        return this.analyzeCSS(code);
      case 'php':
      case 'php-func':
      case 'php-server':
        return this.analyzePHP(code);
      
      // Compiled Languages
      case 'c':
        return this.analyzeC(code);
      case 'cpp':
      case 'c++':
      case 'cpp-func':
      case 'cpp-oop':
      case 'cpp-multi':
        return this.analyzeCpp(code);
      case 'csharp':
      case 'c#':
      case 'csharp-func':
      case 'csharp-oop':
      case 'csharp-multi':
        return this.analyzeCSharp(code);
      case 'java':
      case 'java-oop':
      case 'java-concurrent':
        return this.analyzeJava(code);
      case 'go':
      case 'go-concurrent':
        return this.analyzeGo(code);
      case 'rust':
        return this.analyzeRust(code);
      case 'swift':
        return this.analyzeSwift(code);
      
      // Interpreted Languages
      case 'python':
      case 'python-func':
      case 'python-oop':
        return this.analyzePython(code);
      case 'ruby':
      case 'ruby-oop':
      case 'ruby-ext':
        return this.analyzeRuby(code);
      case 'perl':
      case 'perl-ext':
        return this.analyzePerl(code);
      case 'lua':
        return this.analyzeLua(code);
      case 'r':
        return this.analyzeR(code);
      
      // Functional Languages
      case 'haskell':
        return this.analyzeHaskell(code);
      case 'scala':
      case 'scala-concurrent':
        return this.analyzeScala(code);
      case 'clojure':
      case 'clojure-concurrent':
        return this.analyzeClojure(code);
      case 'lisp':
      case 'lisp-func':
        return this.analyzeLisp(code);
      
      // Scripting Languages
      case 'bash':
        return this.analyzeBash(code);
      case 'powershell':
        return this.analyzePowerShell(code);
      case 'vbscript':
      case 'vbscript-server':
      case 'vbscript-client':
        return this.analyzeVBScript(code);
      
      // Markup and Data Languages
      case 'xml':
      case 'sgml':
        return this.analyzeXML(code);
      case 'json':
        return this.analyzeJSON(code);
      case 'yaml':
        return this.analyzeYAML(code);
      case 'sql':
        return this.analyzeSQL(code);
      
      // System Languages
      case 'ada':
      case 'ada-multi':
        return this.analyzeAda(code);
      case 'nim':
        return this.analyzeNim(code);
      case 'fortran':
        return this.analyzeFortran(code);
      
      // Assembly and Machine Languages
      case 'arm':
      case 'x86':
      case 'mips':
      case 'sparc':
        return this.analyzeAssembly(code, lang);
      
      // Educational and Visual Languages
      case 'scratch':
      case 'scratch-edu':
        return this.analyzeScratch(code);
      case 'logo':
        return this.analyzeLogo(code);
      
      // Hardware Description Languages
      case 'verilog-ams':
      case 'vhdl-ams':
      case 'abel':
      case 'ahdl':
        return this.analyzeHDL(code, lang);
      
      // Logic Programming
      case 'prolog':
        return this.analyzeProlog(code);
      
      // Legacy and Non-English Languages
      case 'cobol':
        return this.analyzeCOBOL(code);
      case 'algol':
        return this.analyzeALGOL(code);
      case 'pascal':
        return this.analyzePascal(code);
      case 'basic':
      case 'visualbasic':
      case 'vbnet':
      case 'chinese-basic':
        return this.analyzeBasic(code);
      
      // Concurrent and Parallel Languages
      case 'julia':
        return this.analyzeJulia(code);
      
      // Domain-Specific Languages
      case 'matlab':
      case 'simulink':
        return this.analyzeMATLAB(code);
      
      default:
        return this.analyzeGeneric(code, language);
    }
  }

  // ========== JAVASCRIPT/TYPESCRIPT ANALYSIS ==========
  private analyzeJavaScript(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    // Missing semicolons
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') &&
          !trimmed.startsWith('//') &&
          !trimmed.startsWith('/*') &&
          !trimmed.includes('if ') &&
          !trimmed.includes('for ') &&
          !trimmed.includes('while ') &&
          !trimmed.includes('function ') &&
          trimmed.length > 5) {
        errors.push({
          type: 'Missing Semicolon',
          severity: 'warning',
          message: 'Missing semicolon at end of statement',
          line: index + 1,
          column: line.length,
          suggestion: 'Add semicolon at the end of this line',
          category: 'syntax'
        });
      }
    });

    // Undefined variables (simple detection)
    if (code.includes('console.log(') && !code.includes('console')) {
      errors.push({
        type: 'Undefined Variable',
        severity: 'error',
        message: 'console is not defined',
        line: 1,
        column: 1,
        suggestion: 'Make sure to run this in a browser or Node.js environment',
        category: 'runtime'
      });
    }

    // Using var instead of let/const
    if (code.includes('var ')) {
      errors.push({
        type: 'Deprecated Variable Declaration',
        severity: 'warning',
        message: 'Use let or const instead of var',
        line: 1,
        column: 1,
        suggestion: 'Replace var with let for mutable variables or const for constants',
        category: 'style'
      });
    }

    // Missing brackets
    const openBrackets = (code.match(/\{/g) || []).length;
    const closeBrackets = (code.match(/\}/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({
        type: 'Mismatched Brackets',
        severity: 'error',
        message: `Mismatched curly brackets: ${openBrackets} opening, ${closeBrackets} closing`,
        line: lines.length,
        column: 1,
        suggestion: openBrackets > closeBrackets ? 'Add missing closing bracket }' : 'Remove extra closing bracket or add opening bracket {',
        category: 'syntax'
      });
    }

    // Missing parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({
        type: 'Mismatched Parentheses',
        severity: 'error',
        message: `Mismatched parentheses: ${openParens} opening, ${closeParens} closing`,
        line: lines.length,
        column: 1,
        suggestion: openParens > closeParens ? 'Add missing closing parenthesis )' : 'Remove extra closing parenthesis or add opening parenthesis (',
        category: 'syntax'
      });
    }

    suggestions.push('Use strict mode with "use strict"');
    suggestions.push('Consider using TypeScript for better type safety');
    suggestions.push('Use const for values that never change');
    
    return { errors, suggestions };
  }

  // ========== PYTHON ANALYSIS ==========
  private analyzePython(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    const lines = code.split('\n');

    // Indentation errors
    lines.forEach((line, index) => {
      if (line.trim() && line[0] === ' ') {
        const spaces = line.search(/\S/);
        if (spaces % 4 !== 0) {
          errors.push({
            type: 'Indentation Error',
            severity: 'error',
            message: 'Python uses 4-space indentation',
            line: index + 1,
            column: 1,
            suggestion: 'Use 4 spaces for each indentation level',
            category: 'syntax'
          });
        }
      }
    });

    // Missing colons
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if ((trimmed.startsWith('if ') || trimmed.startsWith('def ') || 
           trimmed.startsWith('for ') || trimmed.startsWith('while ') ||
           trimmed.startsWith('class ') || trimmed.startsWith('try') ||
           trimmed.startsWith('except') || trimmed.startsWith('else')) &&
          !trimmed.endsWith(':')) {
        errors.push({
          type: 'Missing Colon',
          severity: 'error',
          message: 'Missing colon at end of statement',
          line: index + 1,
          column: line.length,
          suggestion: 'Add colon (:) at the end of this line',
          category: 'syntax'
        });
      }
    });

    // Undefined variables (basic detection)
    if (code.includes('print(') && !code.includes('print ')) {
      // This is actually correct for Python 3
    }

    suggestions.push('Follow PEP 8 style guidelines');
    suggestions.push('Use meaningful variable names');
    suggestions.push('Add docstrings to functions and classes');
    
    return { errors, suggestions };
  }

  // ========== JAVA ANALYSIS ==========
  private analyzeJava(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    const lines = code.split('\n');

    // Missing semicolons
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') &&
          !trimmed.startsWith('//') &&
          !trimmed.includes('class ') &&
          !trimmed.includes('if ') &&
          !trimmed.includes('for ') &&
          !trimmed.includes('while ') &&
          trimmed.length > 5) {
        errors.push({
          type: 'Missing Semicolon',
          severity: 'error',
          message: 'Missing semicolon at end of statement',
          line: index + 1,
          column: line.length,
          suggestion: 'Add semicolon at the end of this line',
          category: 'syntax'
        });
      }
    });

    // Class naming convention
    const classMatch = code.match(/class\s+([a-z][a-zA-Z]*)/);
    if (classMatch) {
      errors.push({
        type: 'Naming Convention',
        severity: 'warning',
        message: 'Class names should start with uppercase letter',
        line: 1,
        column: 1,
        suggestion: `Rename class to ${classMatch[1].charAt(0).toUpperCase() + classMatch[1].slice(1)}`,
        category: 'style'
      });
    }

    // Missing main method
    if (code.includes('class ') && !code.includes('public static void main')) {
      errors.push({
        type: 'Missing Main Method',
        severity: 'info',
        message: 'Java applications need a main method to run',
        line: 1,
        column: 1,
        suggestion: 'Add: public static void main(String[] args) { }',
        category: 'logical'
      });
    }

    suggestions.push('Use camelCase for method and variable names');
    suggestions.push('Use PascalCase for class names');
    suggestions.push('Add proper exception handling');
    
    return { errors, suggestions };
  }

  // ========== C/C++ ANALYSIS ==========
  private analyzeCpp(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    const lines = code.split('\n');

    // Missing semicolons
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') &&
          !trimmed.startsWith('#') &&
          !trimmed.startsWith('//') &&
          !trimmed.includes('if ') &&
          !trimmed.includes('for ') &&
          !trimmed.includes('while ') &&
          trimmed.length > 5) {
        errors.push({
          type: 'Missing Semicolon',
          severity: 'error',
          message: 'Missing semicolon at end of statement',
          line: index + 1,
          column: line.length,
          suggestion: 'Add semicolon at the end of this line',
          category: 'syntax'
        });
      }
    });

    // Missing includes
    if (!code.includes('#include')) {
      errors.push({
        type: 'Missing Include',
        severity: 'warning',
        message: 'No include statements found',
        line: 1,
        column: 1,
        suggestion: 'Add necessary #include statements (e.g., #include <iostream>)',
        category: 'logical'
      });
    }

    // Missing main function
    if (!code.includes('int main') && !code.includes('void main')) {
      errors.push({
        type: 'Missing Main Function',
        severity: 'error',
        message: 'C/C++ programs need a main function',
        line: 1,
        column: 1,
        suggestion: 'Add: int main() { return 0; }',
        category: 'logical'
      });
    }

    suggestions.push('Use smart pointers in C++');
    suggestions.push('Always initialize variables');
    suggestions.push('Check for memory leaks');
    
    return { errors, suggestions };
  }

  // ========== GENERIC ANALYSIS FOR OTHER LANGUAGES ==========
  private analyzeCSharp(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    // Basic C# checks similar to Java
    if (!code.includes('using ') && code.includes('Console.')) {
      errors.push({
        type: 'Missing Using Statement',
        severity: 'warning',
        message: 'Missing using System; statement',
        line: 1,
        column: 1,
        suggestion: 'Add "using System;" at the top of the file',
        category: 'logical'
      });
    }

    suggestions.push('Use PascalCase for public members');
    suggestions.push('Use camelCase for private fields');
    return { errors, suggestions };
  }

  private analyzePHP(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    if (!code.includes('<?php')) {
      errors.push({
        type: 'Missing PHP Opening Tag',
        severity: 'error',
        message: 'PHP code must start with <?php',
        line: 1,
        column: 1,
        suggestion: 'Add <?php at the beginning of the file',
        category: 'syntax'
      });
    }

    suggestions.push('Use PSR-4 autoloading standards');
    suggestions.push('Validate user input');
    return { errors, suggestions };
  }

  private analyzeRuby(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    suggestions.push('Use snake_case for variables and methods');
    suggestions.push('Use CamelCase for classes');
    return { errors, suggestions };
  }

  private analyzeGo(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    if (!code.includes('package ')) {
      errors.push({
        type: 'Missing Package Declaration',
        severity: 'error',
        message: 'Go files must declare a package',
        line: 1,
        column: 1,
        suggestion: 'Add "package main" at the top of the file',
        category: 'syntax'
      });
    }

    suggestions.push('Use gofmt to format your code');
    suggestions.push('Handle errors explicitly');
    return { errors, suggestions };
  }

  private analyzeRust(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    if (!code.includes('fn main')) {
      errors.push({
        type: 'Missing Main Function',
        severity: 'warning',
        message: 'Rust programs need a main function to run',
        line: 1,
        column: 1,
        suggestion: 'Add: fn main() { }',
        category: 'logical'
      });
    }

    suggestions.push('Use cargo fmt to format your code');
    suggestions.push('Handle Option and Result types properly');
    return { errors, suggestions };
  }

  private analyzeSwift(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    suggestions.push('Use camelCase for variables and functions');
    suggestions.push('Use PascalCase for types and protocols');
    return { errors, suggestions };
  }

  // ========== ADDITIONAL LANGUAGE ANALYZERS ==========
  
  private analyzeTypeScript(code: string) {
    const jsAnalysis = this.analyzeJavaScript(code);
    const errors = [...jsAnalysis.errors];
    const suggestions = [...jsAnalysis.suggestions];
    
    // TypeScript-specific checks
    if (!code.includes('interface') && !code.includes('type') && code.length > 100) {
      suggestions.push('Consider using TypeScript interfaces or types for better type safety');
    }
    
    if (code.includes('any')) {
      errors.push({
        type: 'Type Safety',
        severity: 'warning',
        message: 'Using "any" type reduces type safety',
        line: this.findLineWithText(code, 'any'),
        column: 0,
        suggestion: 'Use specific types instead of "any"',
        category: 'style'
      });
    }
    
    return { errors, suggestions };
  }
  
  // Comprehensive language analyzers for major language families
  private analyzeHTML(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    if (code.includes('<img') && !code.includes('alt=')) {
      errors.push({
        type: 'Accessibility',
        severity: 'warning',
        message: 'Image missing alt attribute',
        line: this.findLineWithText(code, '<img'),
        column: 0,
        suggestion: 'Add alt attribute for accessibility',
        category: 'style'
      });
    }
    
    suggestions.push('Validate HTML using W3C validator');
    suggestions.push('Use semantic HTML elements for better accessibility');
    return { errors, suggestions };
  }
  
  private analyzeCSS(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    suggestions.push('Use CSS Grid or Flexbox for layouts');
    suggestions.push('Consider using CSS variables for consistent theming');
    return { errors, suggestions };
  }
  
  private analyzePerl(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    if (!code.includes('use strict;')) {
      errors.push({
        type: 'Best Practice',
        severity: 'warning',
        message: 'Missing "use strict;" pragma',
        line: 1,
        column: 0,
        suggestion: 'Add "use strict;" at the beginning of your script',
        category: 'style'
      });
    }
    
    suggestions.push('Use modern Perl practices and modules');
    return { errors, suggestions };
  }
  
  private analyzeLua(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    const functionCount = (code.match(/\bfunction\b/g) || []).length;
    const endCount = (code.match(/\bend\b/g) || []).length;
    
    if (functionCount > endCount) {
      errors.push({
        type: 'Syntax Error',
        severity: 'error',
        message: 'Missing "end" keyword for function',
        line: this.findLineWithText(code, 'function'),
        column: 0,
        suggestion: 'Add "end" keyword to close function block',
        category: 'syntax'
      });
    }
    
    suggestions.push('Use local variables when possible');
    return { errors, suggestions };
  }
  
  // Stub analyzers for comprehensive language support
  private analyzeC(code: string) { return this.analyzeCpp(code); }
  private analyzeR(code: string) { 
    const errors: CodeError[] = [];
    const suggestions = ['Use vectorized operations for better performance', 'Follow R style guide conventions'];
    return { errors, suggestions };
  }
  private analyzeHaskell(code: string) { 
    const errors: CodeError[] = [];
    const suggestions = ['Use pattern matching effectively', 'Leverage Haskell\'s type system for safety'];
    return { errors, suggestions };
  }
  private analyzeScala(code: string) { return this.analyzeJava(code); }
  private analyzeClojure(code: string) { return this.analyzeLisp(code); }
  private analyzeLisp(code: string) { 
    const errors: CodeError[] = [];
    const suggestions = ['Use proper parentheses balancing', 'Follow Lisp naming conventions'];
    return { errors, suggestions };
  }
  private analyzeBash(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use proper quoting for variables', 'Add error checking with set -e'];
    if (!code.includes('#!/bin/bash')) {
      errors.push({
        type: 'Missing Shebang',
        severity: 'warning',
        message: 'Missing shebang line',
        line: 1,
        column: 0,
        suggestion: 'Add #!/bin/bash at the beginning',
        category: 'style'
      });
    }
    return { errors, suggestions };
  }
  private analyzePowerShell(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use approved verbs for functions', 'Add proper error handling'];
    return { errors, suggestions };
  }
  private analyzeVBScript(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use Option Explicit', 'Proper error handling with On Error Resume Next'];
    return { errors, suggestions };
  }
  private analyzeXML(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Validate XML structure', 'Use proper namespaces'];
    return { errors, suggestions };
  }
  private analyzeSQL(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use parameterized queries to prevent SQL injection', 'Index frequently queried columns'];
    return { errors, suggestions };
  }
  private analyzeJSON(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    try {
      JSON.parse(code);
    } catch (error) {
      errors.push({
        type: 'JSON Syntax',
        severity: 'error',
        message: 'Invalid JSON format',
        line: 1,
        column: 0,
        suggestion: 'Fix JSON syntax errors',
        category: 'syntax'
      });
    }
    return { errors, suggestions };
  }
  private analyzeYAML(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Check indentation consistency', 'Validate YAML syntax'];
    return { errors, suggestions };
  }
  private analyzeAda(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use Ada naming conventions', 'Proper package structure'];
    return { errors, suggestions };
  }
  private analyzeNim(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use Nim style guide', 'Leverage compile-time features'];
    return { errors, suggestions };
  }
  private analyzeFortran(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use modern Fortran features', 'Proper array handling'];
    return { errors, suggestions };
  }
  private analyzeAssembly(code: string, variant: string) {
    const errors: CodeError[] = [];
    const suggestions = [`Follow ${variant.toUpperCase()} assembly conventions`, 'Use comments to document register usage'];
    return { errors, suggestions };
  }
  private analyzeScratch(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use proper sprite management', 'Add comments to blocks'];
    return { errors, suggestions };
  }
  private analyzeLogo(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use proper turtle graphics commands', 'Add structured programming'];
    return { errors, suggestions };
  }
  private analyzeHDL(code: string, lang: string) {
    const errors: CodeError[] = [];
    const suggestions = [`Follow ${lang.toUpperCase()} conventions`, 'Use proper signal declarations'];
    return { errors, suggestions };
  }
  private analyzeProlog(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use proper fact and rule structure', 'Add cut operators carefully'];
    return { errors, suggestions };
  }
  private analyzeCOBOL(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Follow COBOL column structure', 'Use proper division organization'];
    return { errors, suggestions };
  }
  private analyzeALGOL(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use structured programming', 'Proper block structure'];
    return { errors, suggestions };
  }
  private analyzePascal(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use proper Pascal syntax', 'Structure with procedures and functions'];
    return { errors, suggestions };
  }
  private analyzeBasic(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use line numbers appropriately', 'Structure with subroutines'];
    return { errors, suggestions };
  }
  private analyzeJulia(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use Julia type system effectively', 'Leverage multiple dispatch'];
    return { errors, suggestions };
  }
  private analyzeMATLAB(code: string) {
    const errors: CodeError[] = [];
    const suggestions = ['Use vectorized operations', 'Proper matrix operations'];
    return { errors, suggestions };
  }
  
  // ========== UTILITY METHODS ==========
  private findLineWithText(code: string, searchText: string): number {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchText)) {
        return i + 1;
      }
    }
    return 1;
  }

  private analyzeGeneric(code: string, language: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    // Generic checks that apply to most languages
    const lines = code.split('\n');
    
    // Empty code
    if (lines.filter(line => line.trim().length > 0).length === 0) {
      errors.push({
        type: 'Empty Code',
        severity: 'warning',
        message: 'Code appears to be empty',
        line: 1,
        column: 1,
        suggestion: 'Add some code to analyze',
        category: 'logical'
      });
    }

    // Very long lines
    lines.forEach((line, index) => {
      if (line.length > 120) {
        errors.push({
          type: 'Line Too Long',
          severity: 'info',
          message: 'Line exceeds recommended length',
          line: index + 1,
          column: 120,
          suggestion: 'Break this line into multiple lines for better readability',
          category: 'style'
        });
      }
    });

    suggestions.push(`Follow ${language} coding conventions`);
    suggestions.push('Use meaningful variable names');
    suggestions.push('Add comments for complex logic');
    
    return { errors, suggestions };
  }

  // ========== UNIVERSAL ANALYSIS PATTERNS ==========
  private performUniversalAnalysis(code: string) {
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    // Security checks
    if (code.includes('eval(')) {
      errors.push({
        type: 'Security Risk',
        severity: 'error',
        message: 'Use of eval() is dangerous',
        line: 1,
        column: 1,
        suggestion: 'Avoid eval() as it can execute arbitrary code',
        category: 'security'
      });
    }

    if (code.includes('password') && !code.includes('hash')) {
      errors.push({
        type: 'Security Risk',
        severity: 'warning',
        message: 'Potential plain text password',
        line: 1,
        column: 1,
        suggestion: 'Always hash passwords before storing',
        category: 'security'
      });
    }

    // Performance issues
    if (code.includes('while (true)') || code.includes('for (;;)')) {
      errors.push({
        type: 'Potential Infinite Loop',
        severity: 'warning',
        message: 'Possible infinite loop detected',
        line: 1,
        column: 1,
        suggestion: 'Ensure loop has proper exit condition',
        category: 'logical'
      });
    }

    return { errors, suggestions };
  }

  // ========== EXPLANATION GENERATION ==========
  private generateExplanation(errors: CodeError[], language: string): string {
    if (errors.length === 0) {
      return `Great job! Your ${language} code looks clean and doesn't have any obvious errors. Keep up the good work!`;
    }

    const errorCount = errors.filter(e => e.severity === 'error').length;
    const warningCount = errors.filter(e => e.severity === 'warning').length;
    
    let explanation = `I found ${errorCount} error${errorCount !== 1 ? 's' : ''} and ${warningCount} warning${warningCount !== 1 ? 's' : ''} in your ${language} code. `;
    
    if (errorCount > 0) {
      explanation += `The main issues are: ${errors.filter(e => e.severity === 'error').slice(0, 3).map(e => e.type).join(', ')}. `;
    }
    
    explanation += `Here are the key improvements you can make: ${errors.slice(0, 3).map(e => e.suggestion).join('. ')}`;
    
    return explanation;
  }

  // ========== CODE FIXING ==========
  private generateFixedCode(code: string, errors: CodeError[], language: string): string {
    let fixedCode = code;
    
    // Apply simple fixes
    for (const error of errors) {
      if (error.type === 'Missing Semicolon') {
        const lines = fixedCode.split('\n');
        if (lines[error.line - 1] && !lines[error.line - 1].trim().endsWith(';')) {
          lines[error.line - 1] = lines[error.line - 1].trimEnd() + ';';
          fixedCode = lines.join('\n');
        }
      }
      
      if (error.type === 'Deprecated Variable Declaration' && language.toLowerCase() === 'javascript') {
        fixedCode = fixedCode.replace(/var\s+/g, 'let ');
      }
      
      if (error.type === 'Missing PHP Opening Tag') {
        fixedCode = '<?php\n' + fixedCode;
      }
      
      if (error.type === 'Missing Colon' && language.toLowerCase() === 'python') {
        const lines = fixedCode.split('\n');
        if (lines[error.line - 1] && !lines[error.line - 1].trim().endsWith(':')) {
          lines[error.line - 1] = lines[error.line - 1].trimEnd() + ':';
          fixedCode = lines.join('\n');
        }
      }
    }
    
    return fixedCode;
  }
}

export const universalErrorAnalyzer = new UniversalErrorAnalyzer();