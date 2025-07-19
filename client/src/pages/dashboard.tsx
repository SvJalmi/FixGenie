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
  const [selectedVoice, setSelectedVoice] = useState("matthew");
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
    <div className="min-h-screen bg-dark text-text-primary">
      <Header 
        charactersUsed={charactersUsed} 
        maxCharacters={maxCharacters}
        onMenuToggle={toggleSidebar}
        isMenuOpen={isSidebarOpen}
      />
      
      <div className="flex h-[calc(100vh-64px)] relative">
        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="sidebar-mobile-overlay"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${isMobile 
            ? `sidebar-mobile ${isSidebarOpen ? 'open' : ''}`
            : 'sidebar-desktop'
          }
          ${!isMobile ? 'block' : 'hidden lg:block'}
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
          <div className="border-b border-dark-border bg-dark-elevated">
            <div className="flex space-x-1 p-2">
              {[
                { id: "code", label: "Code Editor", icon: "💻" },
                { id: "mentor", label: "AI Mentor", icon: "🧠" },
                { id: "analytics", label: "Analytics", icon: "📊" },
                { id: "collaborate", label: "Collaborate", icon: "👥" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-dark-muted'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0">
            {activeTab === "code" && (
              <div className={`
                h-full flex 
                ${isMobile ? 'flex-col' : 'flex-row'}
              `}>
                <div className="flex-1 min-h-0">
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
                    : 'flex flex-col w-96 border-l'
                  } 
                  border-dark-border bg-dark-elevated
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
              <div className="h-full p-6 overflow-auto bg-dark">
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
              <div className="h-full p-6 overflow-auto bg-dark">
                <AnalyticsDashboard userId={1} />
              </div>
            )}

            {activeTab === "collaborate" && (
              <div className="h-full p-6 overflow-auto bg-dark">
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
