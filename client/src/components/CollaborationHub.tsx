import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, Video, Mic, Share2, Crown, UserPlus, Clock, Globe, VideoIcon, Phone, Monitor, Earth } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface CollaborationHubProps {
  onJoinSession?: (sessionId: string) => void;
}

interface CollaborationSession {
  id: string;
  name: string;
  language: string;
  participants: {
    id: string;
    name: string;
    color: string;
    isActive: boolean;
  }[];
  createdAt: string;
  lastActivity: string;
}

export function CollaborationHub({ onJoinSession }: CollaborationHubProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [participantName, setParticipantName] = useState("Developer");
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  
  // Collaboration feature states
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isGlobalAccess, setIsGlobalAccess] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch active collaboration sessions
  const { data: sessions, isLoading: isSessionsLoading } = useQuery({
    queryKey: ["/api/collaboration/sessions"],
    queryFn: async () => {
      const response = await fetch("/api/collaboration/sessions");
      if (!response.ok) throw new Error("Failed to fetch sessions");
      return response.json();
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Create new session mutation
  const createSessionMutation = useMutation({
    mutationFn: async ({ sessionName, language, participantName }: { sessionName: string; language: string; participantName: string }) => {
      return new Promise((resolve, reject) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          connectWebSocket();
          setTimeout(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'create_session',
                sessionName,
                language,
                code: '',
                participantName
              }));
              resolve({ sessionName });
            } else {
              reject(new Error("Failed to connect to collaboration server"));
            }
          }, 1000);
        } else {
          wsRef.current.send(JSON.stringify({
            type: 'create_session',
            sessionName,
            language,
            code: '',
            participantName
          }));
          resolve({ sessionName });
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collaboration/sessions"] });
      setIsCreateDialogOpen(false);
      setSessionName("");
    }
  });

  const connectWebSocket = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/collaborate`;
      
      wsRef.current = new WebSocket(wsUrl);
      setConnectionStatus("connecting");

      wsRef.current.onopen = () => {
        setConnectionStatus("connected");
        console.log("Connected to collaboration server");
      };

      wsRef.current.onclose = () => {
        setConnectionStatus("disconnected");
        console.log("Disconnected from collaboration server");
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("disconnected");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      setConnectionStatus("disconnected");
    }
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'session_created':
        console.log("Session created:", message.session);
        if (onJoinSession) {
          onJoinSession(message.session.id);
        }
        break;
      case 'session_joined':
        console.log("Joined session:", message.session);
        if (onJoinSession) {
          onJoinSession(message.session.id);
        }
        break;
      case 'participant_joined':
        console.log("Participant joined:", message.participant);
        queryClient.invalidateQueries({ queryKey: ["/api/collaboration/sessions"] });
        break;
      case 'participant_left':
        console.log("Participant left:", message.participantId);
        queryClient.invalidateQueries({ queryKey: ["/api/collaboration/sessions"] });
        break;
      case 'error':
        console.error("Collaboration error:", message.message);
        break;
    }
  };

  const handleCreateSession = () => {
    if (sessionName.trim() && selectedLanguage && participantName.trim()) {
      createSessionMutation.mutate({
        sessionName: sessionName.trim(),
        language: selectedLanguage,
        participantName: participantName.trim()
      });
    }
  };

  const handleJoinSession = (sessionId: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connectWebSocket();
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'join_session',
            sessionId,
            participantName
          }));
        }
      }, 1000);
    } else {
      wsRef.current.send(JSON.stringify({
        type: 'join_session',
        sessionId,
        participantName
      }));
    }
  };

  // Collaboration Feature Functions
  const toggleVideoChat = async () => {
    try {
      if (!isVideoEnabled) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsVideoEnabled(true);
        console.log("Video chat enabled");
      } else {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        setIsVideoEnabled(false);
        console.log("Video chat disabled");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera access denied. Please allow camera permissions for video chat.");
    }
  };

  const toggleVoiceChat = async () => {
    try {
      if (!isVoiceEnabled) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          audio: true 
        });
        setIsVoiceEnabled(true);
        console.log("Voice chat enabled");
        // In a real implementation, you'd connect this to WebRTC
      } else {
        setIsVoiceEnabled(false);
        console.log("Voice chat disabled");
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied. Please allow microphone permissions for voice chat.");
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        setIsScreenSharing(true);
        console.log("Screen sharing enabled");
        
        // Handle when user stops screen sharing via browser UI
        mediaStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } else {
        setIsScreenSharing(false);
        console.log("Screen sharing disabled");
      }
    } catch (error) {
      console.error("Error accessing screen:", error);
      alert("Screen sharing access denied or cancelled.");
    }
  };

  const toggleGlobalAccess = () => {
    setIsGlobalAccess(!isGlobalAccess);
    console.log(`Global access ${!isGlobalAccess ? 'enabled' : 'disabled'}`);
    // In a real implementation, this would update session permissions
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      // Clean up media streams
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const ConnectionStatusBadge = () => (
    <Badge variant={connectionStatus === "connected" ? "default" : connectionStatus === "connecting" ? "secondary" : "destructive"}>
      {connectionStatus === "connected" ? "Online" : connectionStatus === "connecting" ? "Connecting..." : "Offline"}
    </Badge>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-green-500" />
          <h2 className="text-2xl font-bold">Real-Time Collaboration</h2>
          <Badge variant="secondary">Live</Badge>
        </div>
        <div className="flex items-center gap-2">
          <ConnectionStatusBadge />
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Collaboration Session</DialogTitle>
                <DialogDescription>
                  Start a new real-time coding session and invite others to collaborate.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sessionName">Session Name</Label>
                  <Input
                    id="sessionName"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="My Coding Session"
                  />
                </div>
                <div>
                  <Label htmlFor="language">Programming Language</Label>
                  <select
                    id="language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="participantName">Your Name</Label>
                  <Input
                    id="participantName"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <Button 
                  onClick={handleCreateSession}
                  disabled={createSessionMutation.isPending || !sessionName.trim()}
                  className="w-full"
                >
                  {createSessionMutation.isPending ? "Creating..." : "Create Session"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Collaboration Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-card rounded-lg border">
        <div 
          onClick={toggleVideoChat}
          className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isVideoEnabled 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isVideoEnabled ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
          }`}>
            <VideoIcon className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm">Video Chat</h3>
            <p className="text-xs text-gray-500">Face-to-face collaboration</p>
          </div>
          {isVideoEnabled && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>

        <div 
          onClick={toggleVoiceChat}
          className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isVoiceEnabled 
              ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isVoiceEnabled ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
          }`}>
            <Phone className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm">Voice Chat</h3>
            <p className="text-xs text-gray-500">Audio communication</p>
          </div>
          {isVoiceEnabled && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>

        <div 
          onClick={toggleScreenShare}
          className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isScreenSharing 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isScreenSharing ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
          }`}>
            <Monitor className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm">Screen Share</h3>
            <p className="text-xs text-gray-500">Share your screen</p>
          </div>
          {isScreenSharing && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>

        <div 
          onClick={toggleGlobalAccess}
          className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isGlobalAccess 
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' 
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isGlobalAccess ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
          }`}>
            <Earth className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm">Global Access</h3>
            <p className="text-xs text-gray-500">Collaborate worldwide</p>
          </div>
          {isGlobalAccess && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Video Chat Display */}
      {isVideoEnabled && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            You
          </div>
          <div className="absolute bottom-2 left-2 flex gap-2">
            <Button size="sm" variant="outline" onClick={toggleVideoChat}>
              End Video
            </Button>
          </div>
        </div>
      )}

      {/* Active Sessions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Sessions</h3>
        
        {isSessionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session: CollaborationSession) => (
              <Card key={session.id} className="relative hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {session.name}
                        {session.participants.some(p => p.isActive) && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{session.language}</Badge>
                        <span className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(session.lastActivity)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Participants ({session.participants.filter(p => p.isActive).length})
                        </span>
                      </div>
                      <div className="flex -space-x-2">
                        {session.participants.filter(p => p.isActive).slice(0, 4).map((participant, index) => (
                          <Avatar key={participant.id} className="w-8 h-8 border-2 border-background">
                            <AvatarFallback 
                              style={{ backgroundColor: participant.color }}
                              className="text-xs text-white"
                            >
                              {participant.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {session.participants.filter(p => p.isActive).length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs">+{session.participants.filter(p => p.isActive).length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleJoinSession(session.id)}
                        className="flex-1"
                        size="sm"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Join Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Sessions</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create a new collaboration session to start coding with others in real-time.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-1" />
                Create Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium">Video Chat</h4>
              <p className="text-sm text-muted-foreground">Face-to-face collaboration</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Mic className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-medium">Voice Chat</h4>
              <p className="text-sm text-muted-foreground">Audio communication</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium">Screen Share</h4>
              <p className="text-sm text-muted-foreground">Share your screen</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className="font-medium">Global Access</h4>
              <p className="text-sm text-muted-foreground">Collaborate worldwide</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}