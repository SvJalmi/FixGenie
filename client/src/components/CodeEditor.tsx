import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Wand2, AlertTriangle } from "lucide-react";
import { configureMonaco, createErrorMarkers } from "@/lib/monaco";
import { getLanguageById } from "@/lib/languages";
import type { ErrorDetail } from "@shared/schema";

interface CodeEditorProps {
  language: string;
  code: string;
  onCodeChange: (code: string) => void;
  errors: ErrorDetail[];
  onAnalyze: () => void;
  onExplainErrors: () => void;
  isAnalyzing: boolean;
}

export default function CodeEditor({
  language,
  code,
  onCodeChange,
  errors,
  onAnalyze,
  onExplainErrors,
  isAnalyzing,
}: CodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const languageInfo = getLanguageById(language);
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;

  useEffect(() => {
    if (!containerRef.current) return;

    // Configure Monaco
    configureMonaco();

    // Create editor
    const editor = monaco.editor.create(containerRef.current, {
      value: code,
      language: languageInfo?.monacoId || 'javascript',
      theme: 'fixgenie-dark',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineDecorationsWidth: 60,
      lineNumbersMinChars: 3,
      glyphMargin: true,
      folding: true,
      renderLineHighlight: 'line',
      selectionHighlight: true,
      occurrencesHighlight: true,
      bracketPairColorization: { enabled: true },
    });

    editorRef.current = editor;
    setIsEditorReady(true);

    // Listen for content changes
    const subscription = editor.onDidChangeModelContent(() => {
      onCodeChange(editor.getValue());
    });

    return () => {
      subscription.dispose();
      editor.dispose();
    };
  }, []);

  // Update language when it changes
  useEffect(() => {
    if (editorRef.current && languageInfo) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, languageInfo.monacoId);
      }
    }
  }, [language, languageInfo]);

  // Update error markers when errors change
  useEffect(() => {
    if (editorRef.current && isEditorReady) {
      const model = editorRef.current.getModel();
      if (model) {
        const markers = createErrorMarkers(errors);
        monaco.editor.setModelMarkers(model, 'fixgenie', markers);
      }
    }
  }, [errors, isEditorReady]);

  // Update editor value when code prop changes
  useEffect(() => {
    if (editorRef.current && code !== editorRef.current.getValue()) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  const getSampleCode = (lang: string): string => {
    const samples = {
      javascript: `function calculateTotal(items) {
    let total = 0;
    
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    
    // Apply discount if total > 100
    if (total > 100) {
        total = total * 0.9 // Missing semicolon
    }
    
    // Format currency
    return total.toFixed(2) // Should return string with currency symbol
}`,
      python: `def calculate_total(items):
    total = 0
    
    for item in items:
        total += item['price']
    
    # Apply discount if total > 100
    if total > 100:
        total = total * 0.9
    
    # Format currency - missing return statement
    return f"$" + str(total)`,
      java: `public class Calculator {
    public static double calculateTotal(Item[] items) {
        double total = 0;
        
        for (int i = 0; i < items.length; i++) {
            total += items[i].getPrice();
        }
        
        // Apply discount if total > 100
        if (total > 100) {
            total = total * 0.9;
        }
        
        return total // Missing semicolon
    }
}`,
      cpp: `#include <iostream>
#include <vector>

class Calculator {
public:
    double calculateTotal(std::vector<Item>& items) {
        double total = 0.0;
        
        for (auto& item : items) {
            total += item.getPrice();
        }
        
        // Apply discount if total > 100
        if (total > 100) {
            total *= 0.9;
        }
        
        return total; // Memory leak potential with dynamic allocation
    }
};`,
      csharp: `using System;
using System.Collections.Generic;

public class Calculator 
{
    public decimal CalculateTotal(List<Item> items) 
    {
        decimal total = 0;
        
        foreach (var item in items) 
        {
            total += item.Price;
        }
        
        // Apply discount if total > 100
        if (total > 100) 
        {
            total = total * 0.9m;
        }
        
        return total; // Should format as currency
    }
}`,
      php: `<?php
class Calculator {
    public function calculateTotal($items) {
        $total = 0;
        
        foreach ($items as $item) {
            $total += $item->price;
        }
        
        // Apply discount if total > 100
        if ($total > 100) {
            $total = $total * 0.9;
        }
        
        return $total; // Missing currency formatting
    }
}
?>`,
      ruby: `class Calculator
  def calculate_total(items)
    total = 0
    
    items.each do |item|
      total += item.price
    end
    
    # Apply discount if total > 100
    if total > 100
      total = total * 0.9
    end
    
    total # Should return formatted currency
  end
end`,
      go: `package main

import "fmt"

type Item struct {
    Price float64
}

func calculateTotal(items []Item) float64 {
    var total float64
    
    for _, item := range items {
        total += item.Price
    }
    
    // Apply discount if total > 100
    if total > 100 {
        total = total * 0.9
    }
    
    return total // Missing error handling
}`,
      rust: `struct Item {
    price: f64,
}

fn calculate_total(items: &[Item]) -> f64 {
    let mut total = 0.0;
    
    for item in items {
        total += item.price;
    }
    
    // Apply discount if total > 100
    if total > 100.0 {
        total = total * 0.9;
    }
    
    total // Should use Result<f64, Error> for better error handling
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart</title>
</head>
<body>
    <div class="container">
        <h1>Shopping Cart</h1>
        <div id="cart-items">
            <!-- Missing closing div tag -->
        <div class="total">
            <span>Total: $0.00</span>
        </div>
    </div>
</body>
</html>`,
      css: `.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.total {
    font-size: 24px;
    font-weight: bold;
    text-align: right;
    margin-top: 20px;
    color: #333 // Missing semicolon
}`,
      sql: `CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    order_date DATE DEFAULT CURRENT_DATE,
    total_amount DECIMAL(10,2)
);

-- Calculate total sales by customer
SELECT 
    c.name,
    SUM(o.total_amount) as total_sales
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.order_date >= '2024-01-01'
GROUP BY c.id, c.name
ORDER BY total_sales DESC
-- Missing semicolon at end`,
    };
    
    return samples[lang] || samples.javascript;
  };

  const loadSampleCode = () => {
    const sample = getSampleCode(language);
    onCodeChange(sample);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Code Editor Header */}
      <div className="bg-dark-elevated border-b border-dark-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-semibold text-text-primary">Code Editor</h2>
            <div className="flex items-center space-x-2">
              {errorCount > 0 && (
                <>
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                  <span className="text-xs text-text-secondary">
                    {errorCount} {errorCount === 1 ? 'error' : 'errors'} detected
                  </span>
                </>
              )}
              {warningCount > 0 && (
                <>
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-xs text-text-secondary">
                    {warningCount} {warningCount === 1 ? 'warning' : 'warnings'}
                  </span>
                </>
              )}
              {errorCount === 0 && warningCount === 0 && errors.length === 0 && (
                <>
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-text-secondary">No issues detected</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={onExplainErrors}
              disabled={errors.length === 0 || isAnalyzing}
              className="bg-primary-blue hover:bg-blue-600 text-white"
              size="sm"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Explain Errors
            </Button>
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
              className="border-dark-border text-text-primary hover:bg-dark-elevated"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
            </Button>
          </div>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative">
        <div 
          ref={containerRef} 
          className="absolute inset-0 bg-dark"
          style={{ minHeight: '400px' }}
        />
        
        {/* Code is empty state */}
        {!code.trim() && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark/50 backdrop-blur-sm">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Code to Analyze
              </h3>
              <p className="text-text-secondary mb-4">
                Paste your {languageInfo?.name || 'code'} here or load a sample to get started
              </p>
              <Button 
                onClick={loadSampleCode}
                variant="outline"
                className="border-dark-border text-text-primary hover:bg-dark-elevated"
              >
                Load Sample Code
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
