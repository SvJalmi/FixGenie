import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Copy, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { ErrorDetail } from "@shared/schema";

interface ErrorAnalysisPanelProps {
  errors: ErrorDetail[];
  onGenerateVoice: (errorIndex: number) => void;
  onApplyFix: (errorIndex: number) => void;
  isGeneratingVoice: boolean;
}

export default function ErrorAnalysisPanel({
  errors,
  onGenerateVoice,
  onApplyFix,
  isGeneratingVoice,
}: ErrorAnalysisPanelProps) {
  const [copyingIndex, setCopyingIndex] = useState<number | null>(null);

  const syntaxErrors = errors.filter(e => e.severity === 'error');
  const warnings = errors.filter(e => e.severity === 'warning');
  const infos = errors.filter(e => e.severity === 'info');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-error" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive" className="text-xs">SyntaxError</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="text-xs bg-warning/20 text-warning">Warning</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs bg-success/20 text-success">Info</Badge>;
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    setCopyingIndex(index);
    try {
      await navigator.clipboard.writeText(text);
      setTimeout(() => setCopyingIndex(null), 1000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setCopyingIndex(null);
    }
  };

  if (errors.length === 0) {
    return (
      <div className="w-96 bg-dark-elevated border-l border-dark-border flex flex-col">
        <div className="p-4 border-b border-dark-border">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Error Analysis</h3>
          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-success/20 text-success px-2 py-1 rounded">Clean Code</span>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-text-primary mb-2">
              No Issues Found!
            </h4>
            <p className="text-text-secondary text-sm">
              Your code looks clean. No syntax errors, warnings, or issues detected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-dark-elevated border-l border-dark-border flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-dark-border">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Error Analysis</h3>
        <div className="flex items-center space-x-2 text-xs">
          {syntaxErrors.length > 0 && (
            <span className="bg-error/20 text-error px-2 py-1 rounded">
              {syntaxErrors.length} Error{syntaxErrors.length !== 1 ? 's' : ''}
            </span>
          )}
          {warnings.length > 0 && (
            <span className="bg-warning/20 text-warning px-2 py-1 rounded">
              {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
            </span>
          )}
          {infos.length > 0 && (
            <span className="bg-success/20 text-success px-2 py-1 rounded">
              {infos.length} Info
            </span>
          )}
        </div>
      </div>

      {/* Error List */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {errors.map((error, index) => (
          <div
            key={index}
            className={`bg-dark rounded-lg border p-4 ${
              error.severity === 'error' 
                ? 'border-error/30' 
                : error.severity === 'warning'
                ? 'border-warning/30'
                : 'border-success/30'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getSeverityIcon(error.severity)}
                {getSeverityBadge(error.severity)}
              </div>
              <span className="text-xs text-text-secondary bg-dark-elevated px-2 py-1 rounded">
                Line {error.line}
              </span>
            </div>
            
            <p className="text-sm text-text-primary mb-3">{error.message}</p>
            
            {error.suggestion && (
              <div className="bg-dark-elevated rounded p-3 mb-3">
                <p className="text-xs text-text-secondary font-medium mb-1">💡 Suggestion:</p>
                <p className="text-xs text-text-primary">{error.suggestion}</p>
              </div>
            )}

            {/* Voice Controls */}
            <div className="flex items-center justify-between mb-3">
              <Button
                onClick={() => onGenerateVoice(index)}
                disabled={isGeneratingVoice}
                size="sm"
                className="bg-primary-blue hover:bg-blue-600 text-white"
              >
                <Play className="w-3 h-3 mr-2" />
                {isGeneratingVoice ? 'Generating...' : 'Listen to Error'}
              </Button>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(error.message, index)}
                >
                  {copyingIndex === index ? (
                    <CheckCircle className="w-3 h-3 text-success" />
                  ) : (
                    <Copy className="w-3 h-3 text-text-secondary" />
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-3 h-3 text-text-secondary" />
                </Button>
              </div>
            </div>

            {/* Solution */}
            {error.fix && (
              <div className={`border rounded p-3 ${
                error.severity === 'error'
                  ? 'bg-success/10 border-success/30'
                  : 'bg-primary-blue/10 border-primary-blue/30'
              }`}>
                <p className={`text-xs font-medium mb-2 ${
                  error.severity === 'error' ? 'text-success' : 'text-primary-blue'
                }`}>
                  💡 {error.severity === 'error' ? 'Quick Fix' : 'Suggested Improvement'}
                </p>
                <div className="font-mono text-xs text-text-primary mb-2 bg-dark-elevated rounded p-2">
                  {error.fix}
                </div>
                <Button
                  onClick={() => onApplyFix(index)}
                  size="sm"
                  className={
                    error.severity === 'error'
                      ? 'bg-success hover:bg-green-400 text-dark'
                      : 'bg-primary-blue hover:bg-blue-600 text-white'
                  }
                >
                  Apply {error.severity === 'error' ? 'Fix' : 'Improvement'}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
