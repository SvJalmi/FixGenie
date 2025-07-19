import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Wand2, AlertTriangle } from "lucide-react";
import { configureMonaco, createErrorMarkers } from "@/lib/monaco";
import { getLanguageById } from "@/lib/languages";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

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
      // 🧪 Emerging & Specialized Languages
      bosque: `namespace Main;

entity Item {
    field price: Float;
}

function calculateTotal(items: List[Item]): Float {
    var total = 0.0f;
    
    items->foreach(fn(item) => {
        total = total + item.price;
    });
    
    if (total > 100.0f) {
        total = total * 0.9f;
    }
    
    return total;
}`,

      zig: `const std = @import("std");

const Item = struct {
    price: f64,
};

pub fn calculateTotal(items: []const Item) f64 {
    var total: f64 = 0.0;
    
    for (items) |item| {
        total += item.price;
    }
    
    if (total > 100.0) {
        total *= 0.9;
    }
    
    return total;
}

pub fn main() void {
    std.debug.print("Hello, Zig!\\n");
}`,

      'v-lang': `struct Item {
    price f64
}

fn calculate_total(items []Item) f64 {
    mut total := 0.0
    
    for item in items {
        total += item.price
    }
    
    if total > 100.0 {
        total *= 0.9
    }
    
    return total
}

fn main() {
    println('Hello, V!')
}`,

      carbon: `package Main api;

struct Item {
    var price: f64;
}

fn CalculateTotal(items: Array(Item)) -> f64 {
    var total: f64 = 0.0;
    
    for (item: Item in items) {
        total += item.price;
    }
    
    if (total > 100.0) {
        total *= 0.9;
    }
    
    return total;
}

fn Main() -> i32 {
    return 0;
}`,

      vale: `struct Item {
    price f64;
}

fn calculateTotal(items &[]Item) f64 {
    total mut = 0.0;
    
    each item in items {
        set total = total + item.price;
    }
    
    if (total > 100.0) {
        set total = total * 0.9;
    }
    
    ret total;
}`,

      // 🧠 AI & ML-Focused Languages
      mojo: `from memory.unsafe import DTypePointer

struct Item:
    var price: Float64
    
    fn __init__(inout self, price: Float64):
        self.price = price

fn calculate_total(items: List[Item]) -> Float64:
    var total: Float64 = 0.0
    
    for i in range(len(items)):
        total += items[i].price
    
    if total > 100.0:
        total *= 0.9
    
    return total

fn main():
    print("Hello, Mojo!")`,

      gen: `@gen function calculate_total(items::Vector{Item})
    total = 0.0
    
    for item in items
        total += item.price
    end
    
    if total > 100.0
        total *= 0.9
    end
    
    return total
end

struct Item
    price::Float64
end`,

      // 🧬 Scientific & Mathematical
      'j-lang': `calculateTotal =: 3 : 0
total =. 0
for_i. i. # y do.
    total =. total + i { y
end.
if. total > 100 do.
    total =. total * 0.9
end.
total
)`,

      nial: `# Nial - Nested Interactive Array Language
calculateTotal is operation items {
    total := 0.0;
    for item in items do
        total := total + price item;
    endfor;
    if total > 100.0 then
        total := total * 0.9;
    endif;
    total
}

price is operation item {
    item@1  # Access price field (assuming second element)
}`,

      // 🧩 Domain-Specific & DSLs
      elm: `module Main exposing (..)

import Html exposing (text)

type alias Item = 
    { price : Float }

calculateTotal : List Item -> Float
calculateTotal items =
    let
        total = List.foldl (\\item acc -> acc + item.price) 0 items
    in
    if total > 100 then
        total * 0.9
    else
        total

main =
    text "Hello, Elm!"`,

      'pony-dsl': `class Item
  let price: F64
  
  new create(price': F64) =>
    price = price'

actor Calculator
  fun calculate_total(items: Array[Item] val): F64 =>
    var total: F64 = 0.0
    
    for item in items.values() do
      total = total + item.price
    end
    
    if total > 100.0 then
      total * 0.9
    else
      total
    end`,

      'red-dsl': `Red [
    Title: "Calculator"
    Purpose: "Calculate item totals"
]

item: object [
    price: 0.0
]

calculate-total: function [items [block!]] [
    total: 0.0
    
    foreach item items [
        total: total + item/price
    ]
    
    if total > 100.0 [
        total: total * 0.9
    ]
    
    total
]`,

      // 🧙‍♀️ Obscure but Intriguing
      'loop-lang': `; LOOP language - theoretical construct
(define calculate-total
  (lambda (items)
    (let ((total 0))
      (loop for item in items do
        (setq total (+ total (item-price item))))
      (if (> total 100)
          (* total 0.9)
          total))))`,

      frink: `// Frink - units of measure tracking
calculateTotal[items] := 
{
   total = 0.0 dollars
   
   for item = items
      total = total + item.price
   
   if total > 100 dollars
      total = total * 0.9
   
   return total
}`,

      rebol: `REBOL [
    Title: "Calculator"
    Purpose: "Calculate totals with discount"
]

item: make object! [
    price: 0.0
]

calculate-total: func [items [block!]] [
    total: 0.0
    
    foreach item items [
        total: total + item/price
    ]
    
    if total > 100.0 [
        total: total * 0.9
    ]
    
    total
]`
    };
    
    return samples[lang] || samples.javascript;
  };

  const loadSampleCode = async () => {
    try {
      const response = await fetch(`/api/sample-code/${language}`);
      const data = await response.json();
      
      if (data.success && data.code) {
        onCodeChange(data.code);
        toast({
          title: "Sample Code Loaded",
          description: `Loaded ${language} boilerplate code for analysis`,
        });
      } else {
        // Fallback to JavaScript sample
        const fallbackResponse = await fetch('/api/sample-code/javascript');
        const fallbackData = await fallbackResponse.json();
        onCodeChange(fallbackData.code || '// Sample code unavailable');
        toast({
          title: "Sample Code Loaded", 
          description: `Loaded JavaScript sample (${language} not available)`,
        });
      }
    } catch (error) {
      // Emergency fallback to existing hardcoded samples
      const sample = getSampleCode(language);
      onCodeChange(sample);
      toast({
        title: "Sample Code Loaded",
        description: "Loaded local sample code",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col border border-blue-500/20 rounded-lg overflow-hidden bg-dark-elevated/50 min-h-[500px]">
      {/* Code Editor Header */}
      <div className="bg-dark-elevated border-b border-blue-500/30 px-6 py-3">
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
      <div className="flex-1 relative border-t border-blue-500/10 min-h-[400px]">
        <div 
          ref={containerRef} 
          className="absolute inset-0 bg-dark rounded-b-lg w-full h-full"
          style={{ minHeight: '400px', minWidth: '100%' }}
        />
        
        {/* Code is empty state - Centered in the middle */}
        {!code.trim() && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark/80 backdrop-blur-sm z-10" style={{ paddingTop: '160px' }}>
            <div className="text-center space-y-6 px-8 py-8 max-w-md mx-auto">
              <div className="space-y-4">
                <AlertTriangle className="w-16 h-16 text-accent-yellow mx-auto animate-pulse" />
                <h3 className="text-2xl font-bold text-text-primary">
                  No Code to Analyze
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  Paste your {languageInfo?.name || 'JavaScript'} here or load a sample to get started with FixGenie's AI-powered error analysis
                </p>
                <Button 
                  onClick={loadSampleCode}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl shadow-glow transition-all duration-200 hover:scale-105"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Load Sample Code
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
