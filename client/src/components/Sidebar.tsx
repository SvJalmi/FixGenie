import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { PROGRAMMING_LANGUAGES, getAllCategories } from "@/lib/languages";
import type { ErrorAnalysis, MurfVoice } from "@shared/schema";

interface SidebarProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  speechSpeed: number;
  onSpeedChange: (speed: number) => void;
  voices: MurfVoice[];
  recentAnalyses: ErrorAnalysis[];
  onAnalysisSelect: (analysis: ErrorAnalysis) => void;
}

export default function Sidebar({
  selectedLanguage,
  onLanguageChange,
  selectedVoice,
  onVoiceChange,
  speechSpeed,
  onSpeedChange,
  voices,
  recentAnalyses,
  onAnalysisSelect,
}: SidebarProps) {
  const [languageCategory, setLanguageCategory] = useState<string>("all");
  
  const categories = getAllCategories();
  const filteredLanguages = languageCategory === "all" 
    ? PROGRAMMING_LANGUAGES 
    : PROGRAMMING_LANGUAGES.filter(lang => lang.category === languageCategory);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}min ago`;
    return 'Just now';
  };

  const getErrorTypeBadge = (errors: any[]) => {
    const errorCount = errors.filter(e => e.severity === 'error').length;
    const warningCount = errors.filter(e => e.severity === 'warning').length;
    
    if (errorCount > 0) {
      return <Badge variant="destructive" className="text-xs">SyntaxError</Badge>;
    }
    if (warningCount > 0) {
      return <Badge variant="secondary" className="text-xs bg-warning/20 text-warning">Warning</Badge>;
    }
    return <Badge variant="secondary" className="text-xs bg-success/20 text-success">Fixed</Badge>;
  };

  return (
    <aside className="w-80 bg-dark-elevated border-r border-dark-border flex flex-col">
      {/* Language & Voice Settings */}
      <div className="p-6 border-b border-dark-border">
        <h3 className="text-sm font-semibold mb-4 text-text-primary">Language & Voice Settings</h3>
        
        {/* Category Filter */}
        <div className="mb-4">
          <Label className="block text-xs font-medium text-text-secondary mb-2">
            Category Filter
          </Label>
          <Select value={languageCategory} onValueChange={setLanguageCategory}>
            <SelectTrigger className="w-full bg-dark border-dark-border text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Programming Language Selector */}
        <div className="mb-4">
          <Label className="block text-xs font-medium text-text-secondary mb-2">
            Programming Language
          </Label>
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-full bg-dark border-dark-border text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {filteredLanguages.map(language => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                  <span className="ml-2 text-xs text-text-secondary">({language.category})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Selection */}
        <div className="mb-4">
          <Label className="block text-xs font-medium text-text-secondary mb-2">
            Murf Voice
          </Label>
          <Select value={selectedVoice} onValueChange={onVoiceChange}>
            <SelectTrigger className="w-full bg-dark border-dark-border text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {voices.map(voice => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name} ({voice.language}, {voice.gender})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Speed */}
        <div className="mb-4">
          <Label className="block text-xs font-medium text-text-secondary mb-2">
            Speech Speed
          </Label>
          <div className="space-y-2">
            <Slider
              value={[speechSpeed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-text-secondary">
              <span>0.5x</span>
              <span>Current: {speechSpeed}x</span>
              <span>2x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="p-6 border-b border-dark-border">
        <h3 className="text-sm font-semibold mb-4 text-text-primary">Recent Error Fixes</h3>
        <div className="space-y-3">
          {recentAnalyses.length === 0 ? (
            <div className="text-center text-text-secondary text-sm py-4">
              No recent analyses yet
            </div>
          ) : (
            recentAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="p-3 bg-dark rounded-lg border border-dark-border cursor-pointer hover:border-primary-blue transition-colors"
                onClick={() => onAnalysisSelect(analysis)}
              >
                <div className="flex items-center justify-between mb-2">
                  {getErrorTypeBadge(analysis.errors)}
                  <span className="text-xs text-text-secondary">
                    {formatTimeAgo(analysis.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-text-primary mb-1">
                  {analysis.errors.length > 0 
                    ? analysis.errors[0].message 
                    : 'No errors found'
                  }
                </p>
                <p className="text-xs text-text-secondary">
                  {PROGRAMMING_LANGUAGES.find(l => l.id === analysis.language)?.name || analysis.language} • 
                  {analysis.errors.length > 0 ? ` line ${analysis.errors[0].line}` : ' Clean code'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 flex-1">
        <h3 className="text-sm font-semibold mb-4 text-text-primary">Today's Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Errors Fixed</span>
            <span className="text-sm font-semibold text-success">
              {recentAnalyses.reduce((acc, analysis) => 
                acc + analysis.errors.filter(e => e.severity === 'error').length, 0
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">TTS Generated</span>
            <span className="text-sm font-semibold text-primary-blue">
              {recentAnalyses.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Languages Used</span>
            <span className="text-sm font-semibold text-text-primary">
              {new Set(recentAnalyses.map(a => a.language)).size}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
