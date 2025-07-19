import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import { useVoiceCommands, type VoiceCommand } from "@/hooks/useVoiceCommands";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CodeEditor from "@/components/CodeEditor";
import ErrorAnalysisPanel from "@/components/ErrorAnalysisPanel";
import VoicePlayer from "@/components/VoicePlayer";
import FloatingActionButton from "@/components/FloatingActionButton";
import { AIMentor } from "@/components/AIMentor";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { CollaborationHub } from "@/components/CollaborationHub";
import Footer from "@/components/Footer";
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

  // Define voice commands
  const voiceCommands: VoiceCommand[] = [
    {
      command: "analyze_code",
      keywords: ["analyze", "analyze code", "check code", "find errors", "scan code"],
      action: () => handleAnalyzeCode(),
      description: "Analyze the current code for errors"
    },
    {
      command: "explain_errors",
      keywords: ["explain", "explain errors", "read errors", "voice explanation", "speak errors"],
      action: () => handleExplainErrors(),
      description: "Generate voice explanation of errors"
    },
    {
      command: "load_sample",
      keywords: ["load sample", "sample code", "example code", "demo code", "load example"],
      action: () => {
        const samples = {
          javascript: `function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    if (total > 100) {
        total = total * 0.9 // Missing semicolon
    }
    return total.toFixed(2) // Should return string with currency symbol
}`,
          python: `def calculate_total(items):
    total = 0
    for item in items:
        total += item['price']
    if total > 100:
        total = total * 0.9
    return f"$" + str(total)`,
          java: `public class Calculator {
    public static double calculateTotal(Item[] items) {
        double total = 0;
        for (int i = 0; i < items.length; i++) {
            total += items[i].getPrice();
        }
        if (total > 100) {
            total = total * 0.9;
        }
        return total // Missing semicolon
    }
}`
        };
        setCode(samples[selectedLanguage] || samples.javascript);
      },
      description: "Load sample code for the current language"
    },
    {
      command: "clear_code",
      keywords: ["clear", "clear code", "delete code", "reset", "new file"],
      action: () => setCode(""),
      description: "Clear the code editor"
    },
    {
      command: "change_language_javascript",
      keywords: ["javascript", "change to javascript", "switch to javascript", "use javascript"],
      action: () => setSelectedLanguage("javascript"),
      description: "Switch to JavaScript"
    },
    {
      command: "change_language_python",
      keywords: ["python", "change to python", "switch to python", "use python"],
      action: () => setSelectedLanguage("python"),
      description: "Switch to Python"
    },
    {
      command: "change_language_java",
      keywords: ["java", "change to java", "switch to java", "use java"],
      action: () => setSelectedLanguage("java"),
      description: "Switch to Java"
    },
    {
      command: "play_audio",
      keywords: ["play", "play audio", "start playback", "listen", "hear explanation"],
      action: () => setIsVoicePlayerVisible(true),
      description: "Show voice player and play audio"
    },
    {
      command: "stop_audio",
      keywords: ["stop", "stop audio", "pause", "stop playback", "silence"],
      action: () => setIsVoicePlayerVisible(false),
      description: "Hide voice player and stop audio"
    },
    {
      command: "show_help",
      keywords: ["help", "commands", "what can you do", "voice commands", "assistance"],
      action: () => {
        const commandsList = voiceCommands.map(cmd => `• "${cmd.keywords[0]}" - ${cmd.description}`).join('\n');
        toast({
          title: "Available Voice Commands",
          description: `Here are the available voice commands:\n\n${commandsList}`,
        });
      },
      description: "Show available voice commands"
    },
    {
      command: "switch_tab_code",
      keywords: ["code editor", "show code", "code tab", "editor"],
      action: () => setActiveTab("code"),
      description: "Switch to Code Editor tab"
    },
    {
      command: "switch_tab_ai",
      keywords: ["ai mentor", "show ai", "mentor tab", "ai assistant"],
      action: () => setActiveTab("ai"),
      description: "Switch to AI Mentor tab"
    },
    {
      command: "switch_tab_analytics",
      keywords: ["analytics", "show analytics", "statistics", "metrics"],
      action: () => setActiveTab("analytics"),
      description: "Switch to Analytics tab"
    },
    {
      command: "switch_tab_collaborate",
      keywords: ["collaborate", "collaboration", "team", "share"],
      action: () => setActiveTab("collaborate"),
      description: "Switch to Collaboration tab"
    }
  ];

  // Initialize voice commands
  const { isListening, isSupported, toggleListening } = useVoiceCommands({
    commands: voiceCommands,
    language: 'en-US',
    continuous: false,
    interimResults: true
  });

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

  // Generate voice mutation - Fixed to send proper data structure
  const generateVoiceMutation = useMutation({
    mutationFn: async (data: { 
      text: string;
      voiceId: string; 
      speed: number; 
    }) => {
      const response = await apiRequest('POST', '/api/generate-voice', data);
      return response.json();
    },
    onSuccess: (voiceGeneration: any) => {
      console.log('Voice generation successful:', voiceGeneration);
      
      if (voiceGeneration.success) {
        if (voiceGeneration.audioUrl) {
          // External TTS success
          setCurrentAudioUrl(voiceGeneration.audioUrl);
          setIsVoicePlayerVisible(true);
          toast({
            title: "Voice Generated",
            description: `Audio explanation ready (${voiceGeneration.provider})`,
          });
        } else {
          // Browser TTS (this is our primary method now)
          console.log('Using browser TTS for:', voiceGeneration.text);
          
          // Stop any currently speaking speech
          speechSynthesis.cancel();
          
          // Wait a moment for speechSynthesis to be ready
          setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(voiceGeneration.text);
            
            // Set speech parameters
            utterance.rate = Math.min(Math.max(voiceGeneration.speed || 1.0, 0.1), 10);
            utterance.volume = 0.9;
            utterance.pitch = 1.0;
            
            // Try to find a matching voice
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
              // Map our voice IDs to browser voices
              const voiceMap: Record<string, string> = {
                'voice_us_male': 'Google US English',
                'voice_us_female': 'Google US English',
                'voice_uk_male': 'Google UK English Male',
                'voice_uk_female': 'Google UK English Female',
                'voice_in_female': 'Google हिन्दी',
                'voice_in_male': 'Google हिन्दी'
              };
              
              const targetVoiceName = voiceMap[voiceGeneration.voiceId];
              const selectedVoice = voices.find(voice => 
                voice.name.includes(targetVoiceName?.split(' ')[1] || 'English') ||
                voice.lang.startsWith('en')
              );
              
              if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('Using voice:', selectedVoice.name);
              }
            }
            
            utterance.onstart = () => {
              console.log('Browser TTS started');
              toast({
                title: "🔊 Voice Explanation",
                description: "Playing error explanation...",
              });
            };
            
            utterance.onend = () => {
              console.log('Browser TTS finished');
            };
            
            utterance.onerror = (event) => {
              console.error('Browser TTS error:', event);
              toast({
                title: "Speech Error",
                description: "Failed to play voice explanation",
                variant: "destructive",
              });
            };
            
            // Start speaking
            speechSynthesis.speak(utterance);
          }, 100);
        }
      }
    },
    onError: (error: Error) => {
      console.error('Voice generation error:', error);
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

    // Create comprehensive explanation for all errors
    const allErrorsText = currentAnalysis.errors.map((error, index) => {
      return `Error ${index + 1}: ${error.message} on line ${error.line}. 
      ${error.suggestion || ''} 
      ${error.fix ? `Fix: ${error.fix}` : ''}`;
    }).join('\n\n');
    
    const explanationText = `
      Code analysis complete. Found ${currentAnalysis.errors.length} ${currentAnalysis.errors.length === 1 ? 'issue' : 'issues'} in your ${currentAnalysis.language} code.
      
      ${allErrorsText}
      
      Please review these issues and apply the suggested fixes to improve your code quality.
    `.trim();

    console.log('Explaining all errors:', explanationText);

    generateVoiceMutation.mutate({
      text: explanationText,
      voiceId: selectedVoice,
      speed: speechSpeed,
    });
  };

  const handleGenerateVoice = (errorIndex: number) => {
    if (!currentAnalysis || !currentAnalysis.errors[errorIndex]) return;

    const error = currentAnalysis.errors[errorIndex];
    
    // Create comprehensive error explanation text
    const explanationText = `
      Error found on line ${error.line}: ${error.message}
      
      Error type: ${error.type}
      Severity: ${error.severity}
      
      ${error.suggestion ? `Suggestion: ${error.suggestion}` : ''}
      
      ${error.fix ? `Recommended fix: ${error.fix}` : ''}
      
      This error occurs because the code violates ${error.type} rules. 
      ${error.severity === 'error' ? 'This must be fixed for the code to run properly.' : 
        error.severity === 'warning' ? 'This should be addressed to improve code quality.' : 
        'This is informational and can help improve your code.'}
    `.trim();

    console.log('Generating voice for error:', error);
    console.log('Explanation text:', explanationText);

    generateVoiceMutation.mutate({
      text: explanationText,
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
    toggleListening();
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
        isListening={isListening}
        isVoiceSupported={isSupported}
      />
      
      {/* Footer with FixGenie Branding */}
      <Footer />
    </div>
  );
}
