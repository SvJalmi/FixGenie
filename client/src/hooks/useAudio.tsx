import { useState, useRef, useCallback } from 'react';

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export const useAudio = (audioUrl?: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.75,
    isLoading: false,
    error: null,
  });

  const initializeAudio = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration,
        isLoading: false,
      }));
    });

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    });

    audio.addEventListener('ended', () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    });

    audio.addEventListener('error', () => {
      setState(prev => ({
        ...prev,
        error: 'Failed to load audio',
        isLoading: false,
      }));
    });

    audio.volume = state.volume;
  }, [state.volume]);

  const play = useCallback(async (url?: string) => {
    try {
      if (url && url !== audioRef.current?.src) {
        initializeAudio(url);
      }

      if (!audioRef.current) {
        throw new Error('No audio to play');
      }

      await audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true, error: null }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to play audio',
        isPlaying: false,
      }));
    }
  }, [initializeAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const downloadAudio = useCallback(() => {
    if (audioRef.current?.src) {
      const link = document.createElement('a');
      link.href = audioRef.current.src;
      link.download = 'fixgenie-audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    downloadAudio,
  };
};
