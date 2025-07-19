import { WebSocketServer, WebSocket } from 'ws';
import { nanoid } from 'nanoid';

export interface CollaborationSession {
  id: string;
  name: string;
  language: string;
  code: string;
  participants: Participant[];
  createdAt: Date;
  lastActivity: Date;
}

export interface Participant {
  id: string;
  name: string;
  color: string;
  cursor: { line: number; column: number };
  selection: { start: { line: number; column: number }; end: { line: number; column: number } } | null;
  isActive: boolean;
}

export interface CodeChange {
  id: string;
  sessionId: string;
  participantId: string;
  type: 'insert' | 'delete' | 'replace';
  position: { line: number; column: number };
  content: string;
  timestamp: Date;
}

export class CollaborationManager {
  private sessions: Map<string, CollaborationSession> = new Map();
  private connections: Map<string, { ws: WebSocket; sessionId: string; participantId: string }> = new Map();
  private wss: WebSocketServer | null = null;

  initialize(server: any) {
    this.wss = new WebSocketServer({ server, path: '/ws/collaborate' });
    
    this.wss.on('connection', (ws: WebSocket) => {
      const connectionId = nanoid();
      
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(connectionId, ws, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(connectionId);
      });
    });
  }

  private handleMessage(connectionId: string, ws: WebSocket, message: any) {
    switch (message.type) {
      case 'join_session':
        this.handleJoinSession(connectionId, ws, message);
        break;
      case 'create_session':
        this.handleCreateSession(connectionId, ws, message);
        break;
      case 'code_change':
        this.handleCodeChange(connectionId, message);
        break;
      case 'cursor_update':
        this.handleCursorUpdate(connectionId, message);
        break;
      case 'voice_annotation':
        this.handleVoiceAnnotation(connectionId, message);
        break;
    }
  }

  private handleJoinSession(connectionId: string, ws: WebSocket, message: any) {
    const { sessionId, participantName } = message;
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      ws.send(JSON.stringify({ type: 'error', message: 'Session not found' }));
      return;
    }

    const participant: Participant = {
      id: nanoid(),
      name: participantName,
      color: this.generateParticipantColor(),
      cursor: { line: 1, column: 1 },
      selection: null,
      isActive: true
    };

    session.participants.push(participant);
    session.lastActivity = new Date();

    this.connections.set(connectionId, {
      ws,
      sessionId,
      participantId: participant.id
    });

    // Send session state to new participant
    ws.send(JSON.stringify({
      type: 'session_joined',
      session,
      participantId: participant.id
    }));

    // Notify other participants
    this.broadcastToSession(sessionId, {
      type: 'participant_joined',
      participant
    }, participant.id);
  }

  private handleCreateSession(connectionId: string, ws: WebSocket, message: any) {
    const { sessionName, language, code, participantName } = message;
    
    const session: CollaborationSession = {
      id: nanoid(),
      name: sessionName,
      language,
      code: code || '',
      participants: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };

    const participant: Participant = {
      id: nanoid(),
      name: participantName,
      color: this.generateParticipantColor(),
      cursor: { line: 1, column: 1 },
      selection: null,
      isActive: true
    };

    session.participants.push(participant);
    this.sessions.set(session.id, session);

    this.connections.set(connectionId, {
      ws,
      sessionId: session.id,
      participantId: participant.id
    });

    ws.send(JSON.stringify({
      type: 'session_created',
      session,
      participantId: participant.id
    }));
  }

  private handleCodeChange(connectionId: string, message: any) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const session = this.sessions.get(connection.sessionId);
    if (!session) return;

    const change: CodeChange = {
      id: nanoid(),
      sessionId: connection.sessionId,
      participantId: connection.participantId,
      type: message.changeType,
      position: message.position,
      content: message.content,
      timestamp: new Date()
    };

    // Apply change to session code
    session.code = this.applyCodeChange(session.code, change);
    session.lastActivity = new Date();

    // Broadcast change to all participants except sender
    this.broadcastToSession(connection.sessionId, {
      type: 'code_changed',
      change,
      newCode: session.code
    }, connection.participantId);
  }

  private handleCursorUpdate(connectionId: string, message: any) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const session = this.sessions.get(connection.sessionId);
    if (!session) return;

    const participant = session.participants.find(p => p.id === connection.participantId);
    if (!participant) return;

    participant.cursor = message.cursor;
    participant.selection = message.selection;

    this.broadcastToSession(connection.sessionId, {
      type: 'cursor_updated',
      participantId: connection.participantId,
      cursor: message.cursor,
      selection: message.selection
    }, connection.participantId);
  }

  private handleVoiceAnnotation(connectionId: string, message: any) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    this.broadcastToSession(connection.sessionId, {
      type: 'voice_annotation',
      participantId: connection.participantId,
      audioUrl: message.audioUrl,
      position: message.position,
      timestamp: new Date()
    }, connection.participantId);
  }

  private handleDisconnection(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const session = this.sessions.get(connection.sessionId);
    if (session) {
      const participantIndex = session.participants.findIndex(p => p.id === connection.participantId);
      if (participantIndex !== -1) {
        session.participants[participantIndex].isActive = false;
        
        this.broadcastToSession(connection.sessionId, {
          type: 'participant_left',
          participantId: connection.participantId
        });
      }
    }

    this.connections.delete(connectionId);
  }

  private broadcastToSession(sessionId: string, message: any, excludeParticipantId?: string) {
    for (const [connectionId, connection] of this.connections) {
      if (connection.sessionId === sessionId && 
          connection.participantId !== excludeParticipantId) {
        connection.ws.send(JSON.stringify(message));
      }
    }
  }

  private applyCodeChange(code: string, change: CodeChange): string {
    const lines = code.split('\n');
    const { line, column } = change.position;
    
    switch (change.type) {
      case 'insert':
        if (lines[line - 1]) {
          const currentLine = lines[line - 1];
          lines[line - 1] = currentLine.slice(0, column) + change.content + currentLine.slice(column);
        }
        break;
      case 'delete':
        if (lines[line - 1]) {
          const currentLine = lines[line - 1];
          lines[line - 1] = currentLine.slice(0, column) + currentLine.slice(column + change.content.length);
        }
        break;
      case 'replace':
        if (lines[line - 1]) {
          lines[line - 1] = change.content;
        }
        break;
    }
    
    return lines.join('\n');
  }

  private generateParticipantColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getActiveSessionsCount(): number {
    return this.sessions.size;
  }

  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): CollaborationSession[] {
    return Array.from(this.sessions.values());
  }
}

export const collaborationManager = new CollaborationManager();