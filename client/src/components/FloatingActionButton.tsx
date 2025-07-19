import { Button } from "@/components/ui/button";
import { Mic, HelpCircle, Volume2, Zap } from "lucide-react";
import { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";

interface FloatingActionButtonProps {
  onVoiceCommand: () => void;
  onHelp: () => void;
  onQuickAnalyze?: () => void;
  onToggleVoice?: () => void;
  isAnalyzing?: boolean;
  hasAudio?: boolean;
  isListening?: boolean;
  isVoiceSupported?: boolean;
}

export default function FloatingActionButton({ 
  onVoiceCommand, 
  onHelp, 
  onQuickAnalyze,
  onToggleVoice,
  isAnalyzing = false,
  hasAudio = false,
  isListening = false,
  isVoiceSupported = true
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useMobile();

  const handleVoiceCommand = () => {
    onVoiceCommand();
  };

  const buttonSize = isMobile ? "w-14 h-14" : "w-12 h-12";
  const iconSize = isMobile ? "w-6 h-6" : "w-5 h-5";
  const spacing = isMobile ? "space-y-4" : "space-y-3";
  const bottomPosition = isMobile ? "bottom-4 right-4" : "bottom-6 right-6";

  return (
    <div className={`fixed ${bottomPosition} flex flex-col ${spacing} z-50`}>
      {/* Expanded Action Buttons */}
      {isExpanded && (
        <>
          {/* Quick Analyze Button */}
          {onQuickAnalyze && (
            <Button
              onClick={onQuickAnalyze}
              variant="outline"
              size="lg"
              disabled={isAnalyzing}
              className={`${buttonSize} rounded-full shadow-glow border-border glass-card hover:bg-gradient-primary hover:text-white mobile-touch-friendly transition-all duration-300 ${
                isAnalyzing ? 'animate-pulse bg-gradient-primary text-white' : ''
              }`}
              title="Quick Analyze"
            >
              <Zap className={`${iconSize} ${isAnalyzing ? 'text-primary-blue' : 'text-text-secondary'}`} />
            </Button>
          )}

          {/* Toggle Voice Playback */}
          {onToggleVoice && hasAudio && (
            <Button
              onClick={onToggleVoice}
              variant="outline"
              size="lg"
              className={`${buttonSize} rounded-full shadow-glow border-border glass-card hover:bg-gradient-success hover:text-white mobile-touch-friendly transition-all duration-300`}
              title="Toggle Voice Playback"
            >
              <Volume2 className={`${iconSize} text-text-secondary`} />
            </Button>
          )}

          {/* Help Button */}
          <Button
            onClick={onHelp}
            variant="outline"
            size="lg"
            className={`${buttonSize} rounded-full shadow-lg border-dark-border bg-dark-elevated hover:bg-dark hover:text-text-primary mobile-touch-friendly`}
            title="Help & Documentation"
          >
            <HelpCircle className={`${iconSize} text-text-secondary`} />
          </Button>
        </>
      )}
      
      {/* Main Voice Command Button */}
      <Button
        onClick={isExpanded ? () => setIsExpanded(false) : handleVoiceCommand}
        onDoubleClick={isMobile ? () => setIsExpanded(!isExpanded) : undefined}
        size="lg"
        className={`${buttonSize} rounded-full shadow-xl transition-all duration-300 mobile-touch-friendly ${
          isListening 
            ? 'bg-error hover:bg-red-600 animate-pulse-glow scale-110' 
            : isExpanded
            ? 'bg-primary-blue/80 hover:bg-primary-blue rotate-45'
            : 'bg-primary-blue hover:bg-blue-600 hover:scale-105'
        }`}
        title={
          !isVoiceSupported ? "Voice commands not supported" : 
          isListening ? "Listening... (Click to stop)" : 
          isExpanded ? "Close Menu" : "Voice Commands (Click to start)"
        }
      >
        <Mic className={`${iconSize} transition-transform duration-200 ${
          isListening ? 'scale-110 text-white' : 'text-white'
        }`} />
      </Button>

      {/* Voice Status Indicator */}
      {isListening && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-dark-elevated border border-dark-border rounded-lg px-4 py-2 shadow-xl">
            <span className="text-sm text-text-primary flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-error rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-3 h-3 bg-error rounded-full animate-ping"></div>
              </div>
              <span className="font-medium">Listening for commands...</span>
            </span>
            <div className="text-xs text-text-secondary mt-1 text-center">
              Say "help" for available commands
            </div>
          </div>
        </div>
      )}

      {/* Voice Unsupported Indicator */}
      {!isVoiceSupported && isExpanded && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-dark-elevated border border-orange-500 rounded-lg px-3 py-1 shadow-lg">
            <span className="text-xs text-orange-400 flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Voice not supported</span>
            </span>
          </div>
        </div>
      )}

      {/* Expand Hint for Mobile */}
      {isMobile && !isExpanded && !isListening && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
          <div className="text-xs text-text-secondary bg-dark-elevated rounded px-2 py-1 whitespace-nowrap">
            Hold for menu
          </div>
        </div>
      )}
    </div>
  );
}
