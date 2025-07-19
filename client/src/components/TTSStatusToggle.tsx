import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TTSStatusToggleProps {
  className?: string;
  compact?: boolean;
}

export default function TTSStatusToggle({ className, compact = false }: TTSStatusToggleProps) {
  const [ttsStatus, setTtsStatus] = useState<'ready' | 'disabled' | 'connecting' | 'error'>('ready');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call to toggle TTS service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatus = ttsStatus === 'ready' ? 'disabled' : 'ready';
      setTtsStatus(newStatus);
      
      toast({
        title: `TTS ${newStatus === 'ready' ? 'Enabled' : 'Disabled'}`,
        description: newStatus === 'ready' 
          ? "Text-to-speech is now available for error explanations"
          : "Text-to-speech has been disabled",
      });
    } catch (error) {
      setTtsStatus('error');
      toast({
        title: "TTS Error",
        description: "Failed to toggle text-to-speech service",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = () => {
    switch (ttsStatus) {
      case 'ready':
        return {
          text: 'Murf TTS Ready',
          icon: Volume2,
          color: 'bg-accent-green',
          textColor: 'text-text-primary',
          bgColor: 'glass',
          shadowColor: 'shadow-success',
          dotColor: 'bg-accent-green'
        };
      case 'disabled':
        return {
          text: 'TTS Disabled',
          icon: VolumeX,
          color: 'bg-gray-500',
          textColor: 'text-text-secondary',
          bgColor: 'glass opacity-60',
          shadowColor: '',
          dotColor: 'bg-gray-500'
        };
      case 'connecting':
        return {
          text: 'TTS Connecting...',
          icon: Loader2,
          color: 'bg-accent-blue',
          textColor: 'text-text-primary',
          bgColor: 'glass',
          shadowColor: 'shadow-glow',
          dotColor: 'bg-accent-blue'
        };
      case 'error':
        return {
          text: 'TTS Error',
          icon: VolumeX,
          color: 'bg-accent-red',
          textColor: 'text-text-primary',
          bgColor: 'glass border-red-500/20',
          shadowColor: 'shadow-error',
          dotColor: 'bg-accent-red'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const ButtonContent = () => (
    <div className={`
      flex items-center space-x-2 rounded-lg px-3 py-2 transition-all duration-300 hover:scale-105 cursor-pointer
      ${config.bgColor} ${config.shadowColor}
    `}>
      {/* Status Indicator Dot */}
      <div className={`
        w-2 h-2 rounded-full transition-all duration-300
        ${config.dotColor}
        ${ttsStatus === 'ready' ? 'animate-pulse' : ''}
        ${ttsStatus === 'connecting' ? 'animate-bounce' : ''}
        ${ttsStatus === 'error' ? 'animate-ping' : ''}
      `} />
      
      {/* Icon */}
      <IconComponent className={`
        w-4 h-4 transition-all duration-300
        ${config.textColor}
        ${ttsStatus === 'connecting' ? 'animate-spin' : ''}
      `} />
      
      {/* Text - Hide on compact mode or small screens */}
      {!compact && (
        <span className={`text-sm font-medium transition-all duration-300 ${config.textColor}`}>
          {config.text}
        </span>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <Loader2 className="w-3 h-3 animate-spin text-accent-blue" />
      )}
    </div>
  );

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              disabled={isLoading}
              className={`p-0 h-auto hover:bg-transparent ${className}`}
            >
              <ButtonContent />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">{config.text}</p>
              <p className="text-xs text-muted-foreground">
                Click to {ttsStatus === 'ready' ? 'disable' : 'enable'} text-to-speech
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`hidden lg:flex ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={isLoading}
        className="p-0 h-auto hover:bg-transparent"
      >
        <ButtonContent />
      </Button>
    </div>
  );
}