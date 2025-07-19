import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, Volume2, Download } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { useEffect } from "react";

interface VoicePlayerProps {
  audioUrl?: string;
  title?: string;
  isVisible: boolean;
}

export default function VoicePlayer({ audioUrl, title, isVisible }: VoicePlayerProps) {
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    isLoading, 
    play, 
    pause, 
    seekTo, 
    setVolume, 
    downloadAudio 
  } = useAudio();

  useEffect(() => {
    if (audioUrl && isVisible) {
      play(audioUrl);
    }
  }, [audioUrl, isVisible, play]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    seekTo((value[0] / 100) * duration);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="p-4 border-t border-dark-border bg-dark">
      {/* Progress and Time */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">
            {title || 'Now Playing'}
          </span>
          <span className="text-xs text-text-secondary">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <Slider
          value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
          onValueChange={handleProgressChange}
          max={100}
          step={1}
          className="w-full"
          disabled={!audioUrl || isLoading}
        />
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="sm"
            onClick={isPlaying ? pause : () => audioUrl && play(audioUrl)}
            disabled={!audioUrl || isLoading}
            className={isPlaying ? "bg-primary-blue hover:bg-blue-600" : "border-dark-border"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!audioUrl}
            className="text-text-secondary hover:text-text-primary"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-text-secondary" />
          <Slider
            value={[volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-16"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadAudio}
            disabled={!audioUrl}
            className="text-text-secondary hover:text-text-primary"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
