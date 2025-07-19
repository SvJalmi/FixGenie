import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CodeEditor from "@/components/CodeEditor";
import ErrorAnalysisPanel from "@/components/ErrorAnalysisPanel";
import VoicePlayer from "@/components/VoicePlayer";
import FloatingActionButton from "@/components/FloatingActionButton";
import { AIMentor } from "@/components/AIMentor";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { CollaborationHub } from "@/components/CollaborationHub";
import { apiRequest } from "@/lib/queryClient";
import type { ErrorAnalysis, MurfVoice, VoiceGeneration } from "@shared/schema";

export default function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedVoice, setSelectedVoice] = useState("voice_us_male");
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [code, setCode] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<ErrorAnalysis | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");
  const [isVoicePlayerVisible, setIsVoicePlayerVisible] = useState(false);
  const [charactersUsed] = useState(2400);
  const [maxCharacters] = useState(50000000);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useMobile();

  // Fetch voices
  const { data: voices = [] } = useQuery<MurfVoice[]>({
    queryKey: ['/api/voices'],
  });

  // Fetch recent analyses
  const { data: recentAnalyses = [] } = useQuery<ErrorAnalysis[]>({
    queryKey: ['/api/recent-analyses'],
  });

  // Analyze code mutation
  const analyzeCodeMutation = useMutation({
    mutationFn: async (data: { code: string; language: string }) => {
      const response = await apiRequest('POST', '/api/analyze', data);
      return response.json();
    },
    onSuccess: (analysis: ErrorAnalysis) => {
      setCurrentAnalysis(analysis);
      queryClient.invalidateQueries({ queryKey: ['/api/recent-analyses'] });
      toast({
        title: "Analysis Complete",
        description: `Found ${analysis.errors.length} issue${analysis.errors.length !== 1 ? 's' : ''} in your code.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate voice mutation
  const generateVoiceMutation = useMutation({
    mutationFn: async (data: { 
      errorAnalysisId: number; 
      errorIndex: number; 
      voiceId: string; 
      speed: number; 
    }) => {
      const response = await apiRequest('POST', '/api/generate-voice', data);
      return response.json();
    },
    onSuccess: (voiceGeneration: VoiceGeneration) => {
      if (voiceGeneration.audioUrl) {
        setCurrentAudioUrl(voiceGeneration.audioUrl);
        setIsVoicePlayerVisible(true);
        toast({
          title: "Voice Generated",
          description: "Audio explanation is ready to play.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Voice Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyzeCode = () => {
    if (!code.trim()) {
      toast({
        title: "No Code to Analyze",
        description: "Please enter some code first.",
        variant: "destructive",
      });
      return;
    }

    analyzeCodeMutation.mutate({
      code: code.trim(),
      language: selectedLanguage,
    });
  };

  const handleExplainErrors = () => {
    if (!currentAnalysis || currentAnalysis.errors.length === 0) {
      toast({
        title: "No Errors to Explain",
        description: "Please analyze your code first.",
        variant: "destructive",
      });
      return;
    }

    // Generate voice for the first error
    handleGenerateVoice(0);
  };

  const handleGenerateVoice = (errorIndex: number) => {
    if (!currentAnalysis) return;

    generateVoiceMutation.mutate({
      errorAnalysisId: currentAnalysis.id,
      errorIndex,
      voiceId: selectedVoice,
      speed: speechSpeed,
    });
  };

  const handleApplyFix = (errorIndex: number) => {
    if (!currentAnalysis || !currentAnalysis.errors[errorIndex]?.fix) return;

    const error = currentAnalysis.errors[errorIndex];
    const lines = code.split('\n');
    
    if (error.line <= lines.length) {
      lines[error.line - 1] = error.fix;
      setCode(lines.join('\n'));
      
      toast({
        title: "Fix Applied",
        description: `Applied fix for line ${error.line}.`,
      });
    }
  };

  const handleAnalysisSelect = (analysis: ErrorAnalysis) => {
    setCurrentAnalysis(analysis);
    setCode(analysis.code);
    setSelectedLanguage(analysis.language);
  };

  const handleVoiceCommand = () => {
    // TODO: Implement voice command recognition
    toast({
      title: "Voice Commands",
      description: "Voice command feature coming soon!",
    });
  };

  const handleHelp = () => {
    toast({
      title: "Help & Documentation",
      description: "Opening help documentation...",
    });
  };

  // Auto-analyze when code changes (debounced)
  useEffect(() => {
    if (!code.trim()) {
      setCurrentAnalysis(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleAnalyzeCode();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [code, selectedLanguage]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        charactersUsed={charactersUsed} 
        maxCharacters={maxCharacters}
        onMenuToggle={toggleSidebar}
        isMenuOpen={isSidebarOpen}
      />
      
      <div className="flex h-[calc(100vh-64px)] relative">
        {/* Mobile Sidebar Overlay - Only show on actual mobile devices */}
        {isMobile && isSidebarOpen && (
          <div 
            className="sidebar-mobile-overlay lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar - Always visible on desktop, mobile overlay when open */}
        <div className={`
          ${isMobile 
            ? `sidebar-mobile ${isSidebarOpen ? 'open' : ''}`
            : 'sidebar-desktop block'
          }
        `}>
          <Sidebar
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
            speechSpeed={speechSpeed}
            onSpeedChange={setSpeechSpeed}
            voices={voices}
            recentAnalyses={recentAnalyses}
            onAnalysisSelect={handleAnalysisSelect}
          />
        </div>
        
        {/* Main Content with Advanced Features */}
        <div className={`
          flex-1 flex flex-col
          ${isMobile && isSidebarOpen ? 'pointer-events-none' : ''}
        `}>
          {/* Tab Navigation */}
          <div className="border-b border-border bg-elevated glass-card tab-navigation">
            <div className="tab-container flex space-x-1 p-3 lg:space-x-2">
              {[
                { id: "code", label: "Code Editor", icon: "💻", shortLabel: "Code" },
                { id: "mentor", label: "AI Mentor", icon: "🧠", shortLabel: "Mentor" },
                { id: "analytics", label: "Analytics", icon: "📊", shortLabel: "Analytics" },
                { id: "collaborate", label: "Collaborate", icon: "👥", shortLabel: "Collab" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    tab-button px-3 py-2 md:px-6 md:py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden
                    ${activeTab === tab.id 
                      ? 'bg-gradient-primary text-white shadow-glow transform scale-105' 
                      : 'text-secondary hover:text-primary glass hover:shadow-glow/50'
                    }
                  `}
                >
                  <span className="mr-1 md:mr-2 text-sm md:text-base">{tab.icon}</span>
                  <span className="font-semibold hidden sm:inline">{tab.label}</span>
                  <span className="font-semibold sm:hidden">{tab.shortLabel}</span>
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 main-content">
            {activeTab === "code" && (
              <div className={`
                h-full flex editor-container
                ${isMobile ? 'flex-col' : 'flex-row'}
              `}>
                <div className="flex-1 min-h-0 code-editor-wrapper">
                  <CodeEditor
                    language={selectedLanguage}
                    code={code}
                    onCodeChange={setCode}
                    errors={currentAnalysis?.errors || []}
                    onAnalyze={handleAnalyzeCode}
                    onExplainErrors={handleExplainErrors}
                    isAnalyzing={analyzeCodeMutation.isPending}
                  />
                </div>
                
                <div className={`
                  ${isMobile 
                    ? 'error-panel-mobile border-t' 
                    : 'flex flex-col w-96 lg:w-[28rem] xl:w-96 border-l'
                  } 
                  border-border bg-elevated glass-card error-analysis-panel
                `}>
                  <ErrorAnalysisPanel
                    errors={currentAnalysis?.errors || []}
                    onGenerateVoice={handleGenerateVoice}
                    onApplyFix={handleApplyFix}
                    isGeneratingVoice={generateVoiceMutation.isPending}
                  />
                  
                  <VoicePlayer
                    audioUrl={currentAudioUrl}
                    title="Error Explanation"
                    isVisible={isVoicePlayerVisible}
                  />
                </div>
              </div>
            )}

            {activeTab === "mentor" && (
              <div className="h-full p-3 md:p-6 overflow-auto bg-background tab-content">
                <AIMentor
                  code={code}
                  language={selectedLanguage}
                  onCodeSuggestion={(suggestion) => {
                    if (suggestion.suggestedCode) {
                      setCode(suggestion.suggestedCode);
                    }
                  }}
                />
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="h-full p-3 md:p-6 overflow-auto bg-background tab-content">
                <AnalyticsDashboard userId={1} />
              </div>
            )}

            {activeTab === "collaborate" && (
              <div className="h-full p-3 md:p-6 overflow-auto bg-background tab-content">
                <CollaborationHub
                  onJoinSession={(sessionId) => {
                    toast({
                      title: "Joined Collaboration Session",
                      description: `Connected to session: ${sessionId}`,
                    });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingActionButton
        onVoiceCommand={handleVoiceCommand}
        onHelp={handleHelp}
        onQuickAnalyze={handleAnalyzeCode}
        onToggleVoice={() => setIsVoicePlayerVisible(!isVoicePlayerVisible)}
        isAnalyzing={analyzeCodeMutation.isPending}
        hasAudio={!!currentAudioUrl}
      />
    </div>
  );
}
