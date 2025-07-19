import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface VoiceCommand {
  command: string;
  keywords: string[];
  action: () => void;
  description: string;
}

export interface UseVoiceCommandsOptions {
  commands: VoiceCommand[];
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export function useVoiceCommands({ 
  commands, 
  language = 'en-US',
  continuous = false,
  interimResults = true 
}: UseVoiceCommandsOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Check if speech recognition is supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    } else {
      console.warn('Speech recognition not supported in this browser');
      setIsSupported(false);
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.toLowerCase().trim();
      const confidence = result[0].confidence;

      console.log('Voice recognition result:', transcript, 'Confidence:', confidence);
      
      setTranscript(transcript);
      setConfidence(confidence);

      // Process the command if it's a final result
      if (result.isFinal) {
        processVoiceCommand(transcript, confidence);
      }
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone permissions to use voice commands.",
          variant: "destructive",
        });
      } else if (event.error === 'no-speech') {
        toast({
          title: "No Speech Detected",
          description: "Try speaking more clearly or check your microphone.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported, language, continuous, interimResults]);

  // Process voice command
  const processVoiceCommand = useCallback((transcript: string, confidence: number) => {
    console.log('Processing voice command:', transcript);

    // Find matching command
    const matchedCommand = commands.find(cmd => 
      cmd.keywords.some(keyword => 
        transcript.includes(keyword.toLowerCase())
      )
    );

    if (matchedCommand && confidence > 0.6) {
      console.log('Executing command:', matchedCommand.command);
      
      toast({
        title: "Voice Command Recognized",
        description: `Executing: ${matchedCommand.description}`,
      });

      // Execute the command
      try {
        matchedCommand.action();
      } catch (error) {
        console.error('Error executing voice command:', error);
        toast({
          title: "Command Execution Failed",
          description: "An error occurred while executing the voice command.",
          variant: "destructive",
        });
      }
    } else {
      console.log('No matching command found or low confidence');
      
      if (confidence < 0.6) {
        toast({
          title: "Voice Not Clear",
          description: "Please speak more clearly and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Command Not Recognized",
          description: `"${transcript}" is not a recognized command. Try "help" to see available commands.`,
          variant: "destructive",
        });
      }
    }
  }, [commands, toast]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      toast({
        title: "Voice Commands Not Supported",
        description: "Your browser doesn't support voice recognition. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Voice Recognition Failed",
          description: "Could not start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [isSupported, isListening, toast]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    startListening,
    stopListening,
    toggleListening,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}