// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';
import { Game, Player, PlayerAction } from './poker';

// Types pour les événements socket
export type GameEvent = {
  gameId: string;
  tableId: number;
  event: string;
  data: any;
};

export type PlayerActionEvent = {
  gameId: string;
  playerId: number;
  action: PlayerAction;
  amount?: number;
};

export type ChatMessageEvent = {
  gameId: string;
  userId: number;
  username: string;
  message: string;
  timestamp: number;
};

// Classe pour gérer la connexion socket
export class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private gameEventListeners: ((event: GameEvent) => void)[] = [];
  private chatEventListeners: ((event: ChatMessageEvent) => void)[] = [];
  private connectionEventListeners: ((connected: boolean) => void)[] = [];

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public connect(userId: number, token: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    // Connexion au serveur socket avec authentification
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token
      },
      query: {
        userId: userId.toString()
      }
    });

    // Gestion des événements de connexion
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.notifyConnectionListeners(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.notifyConnectionListeners(false);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.notifyConnectionListeners(false);
    });

    // Gestion des événements de jeu
    this.socket.on('game_event', (event: GameEvent) => {
      this.notifyGameEventListeners(event);
    });

    // Gestion des événements de chat
    this.socket.on('chat_message', (event: ChatMessageEvent) => {
      this.notifyChatEventListeners(event);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Méthodes pour rejoindre/quitter une table
  public joinTable(tableId: number): void {
    if (this.socket) {
      this.socket.emit('join_table', { tableId });
    }
  }

  public leaveTable(tableId: number): void {
    if (this.socket) {
      this.socket.emit('leave_table', { tableId });
    }
  }

  // Méthodes pour les actions de jeu
  public performAction(event: PlayerActionEvent): void {
    if (this.socket) {
      this.socket.emit('player_action', event);
    }
  }

  // Méthode pour envoyer un message de chat
  public sendChatMessage(gameId: string, message: string): void {
    if (this.socket) {
      this.socket.emit('chat_message', { gameId, message });
    }
  }

  // Méthodes pour ajouter/supprimer des écouteurs d'événements
  public addGameEventListener(listener: (event: GameEvent) => void): void {
    this.gameEventListeners.push(listener);
  }

  public removeGameEventListener(listener: (event: GameEvent) => void): void {
    this.gameEventListeners = this.gameEventListeners.filter(l => l !== listener);
  }

  public addChatEventListener(listener: (event: ChatMessageEvent) => void): void {
    this.chatEventListeners.push(listener);
  }

  public removeChatEventListener(listener: (event: ChatMessageEvent) => void): void {
    this.chatEventListeners = this.chatEventListeners.filter(l => l !== listener);
  }

  public addConnectionEventListener(listener: (connected: boolean) => void): void {
    this.connectionEventListeners.push(listener);
  }

  public removeConnectionEventListener(listener: (connected: boolean) => void): void {
    this.connectionEventListeners = this.connectionEventListeners.filter(l => l !== listener);
  }

  // Méthodes pour notifier les écouteurs
  private notifyGameEventListeners(event: GameEvent): void {
    this.gameEventListeners.forEach(listener => listener(event));
  }

  private notifyChatEventListeners(event: ChatMessageEvent): void {
    this.chatEventListeners.forEach(listener => listener(event));
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionEventListeners.forEach(listener => listener(connected));
  }
}
