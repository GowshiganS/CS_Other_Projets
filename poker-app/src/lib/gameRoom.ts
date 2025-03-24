// src/lib/gameRoom.ts
import { Game, Player, PlayerAction, createGame, performPlayerAction } from './poker';
import { getUserById } from './db';

// Types pour les salles de jeu
export type GameRoom = {
  id: number;
  name: string;
  maxPlayers: number;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  isPrivate: boolean;
  password?: string;
  players: RoomPlayer[];
  activeGame?: Game;
  status: 'waiting' | 'active' | 'completed';
};

export type RoomPlayer = {
  id: number;
  username: string;
  avatarUrl?: string;
  chips: number;
  seatPosition: number;
  isReady: boolean;
};

// Classe pour gérer les salles de jeu
export class GameRoomManager {
  private static instance: GameRoomManager;
  private rooms: Map<number, GameRoom> = new Map();

  private constructor() {}

  public static getInstance(): GameRoomManager {
    if (!GameRoomManager.instance) {
      GameRoomManager.instance = new GameRoomManager();
    }
    return GameRoomManager.instance;
  }

  // Méthodes pour gérer les salles
  public createRoom(
    name: string,
    maxPlayers: number,
    smallBlind: number,
    bigBlind: number,
    minBuyIn: number,
    maxBuyIn: number,
    isPrivate: boolean,
    password?: string
  ): GameRoom {
    const id = Date.now(); // Utiliser un timestamp comme ID temporaire
    const room: GameRoom = {
      id,
      name,
      maxPlayers,
      smallBlind,
      bigBlind,
      minBuyIn,
      maxBuyIn,
      isPrivate,
      password,
      players: [],
      status: 'waiting'
    };

    this.rooms.set(id, room);
    return room;
  }

  public getRoom(roomId: number): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  public getAllRooms(): GameRoom[] {
    return Array.from(this.rooms.values());
  }

  public deleteRoom(roomId: number): boolean {
    return this.rooms.delete(roomId);
  }

  // Méthodes pour gérer les joueurs dans une salle
  public async addPlayerToRoom(roomId: number, userId: number, buyIn: number, seatPosition: number): Promise<boolean> {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    // Vérifier si la salle est pleine
    if (room.players.length >= room.maxPlayers) return false;

    // Vérifier si le siège est déjà occupé
    if (room.players.some(p => p.seatPosition === seatPosition)) return false;

    // Vérifier si le joueur a suffisamment de jetons
    const user = await getUserById(userId);
    if (!user || user.chips < buyIn) return false;

    // Vérifier si le buy-in est dans les limites
    if (buyIn < room.minBuyIn || buyIn > room.maxBuyIn) return false;

    // Ajouter le joueur à la salle
    const player: RoomPlayer = {
      id: userId,
      username: user.username,
      avatarUrl: user.avatar_url,
      chips: buyIn,
      seatPosition,
      isReady: false
    };

    room.players.push(player);
    return true;
  }

  public removePlayerFromRoom(roomId: number, userId: number): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const initialLength = room.players.length;
    room.players = room.players.filter(p => p.id !== userId);

    return room.players.length < initialLength;
  }

  public setPlayerReady(roomId: number, userId: number, isReady: boolean): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const player = room.players.find(p => p.id === userId);
    if (!player) return false;

    player.isReady = isReady;
    return true;
  }

  // Méthodes pour gérer le jeu
  public startGame(roomId: number): Game | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Vérifier si tous les joueurs sont prêts
    if (!room.players.every(p => p.isReady)) return null;

    // Vérifier s'il y a au moins 2 joueurs
    if (room.players.length < 2) return null;

    // Convertir les joueurs de la salle en joueurs de poker
    const players: Player[] = room.players.map(p => ({
      id: p.id,
      username: p.username,
      chips: p.chips,
      hand: [],
      bet: 0,
      totalBet: 0,
      folded: false,
      isAllIn: false,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      isActive: false,
      position: p.seatPosition
    }));

    // Créer une nouvelle partie
    const game = createGame(roomId, players, room.smallBlind, room.bigBlind);
    room.activeGame = game;
    room.status = 'active';

    return game;
  }

  public performAction(roomId: number, playerId: number, action: PlayerAction, amount?: number): Game | null {
    const room = this.rooms.get(roomId);
    if (!room || !room.activeGame) return null;

    // Effectuer l'action du joueur
    const updatedGame = performPlayerAction(room.activeGame, playerId, action, amount);
    room.activeGame = updatedGame;

    // Vérifier si la partie est terminée
    if (updatedGame.stage === 'showdown' && updatedGame.winners) {
      this.endGame(roomId);
    }

    return updatedGame;
  }

  private endGame(roomId: number): void {
    const room = this.rooms.get(roomId);
    if (!room || !room.activeGame) return;

    // Distribuer les gains aux gagnants
    if (room.activeGame.winners) {
      for (const winner of room.activeGame.winners) {
        const player = room.players.find(p => p.id === winner.playerId);
        if (player) {
          player.chips += winner.amount;
        }
      }
    }

    // Réinitialiser l'état des joueurs
    for (const player of room.players) {
      player.isReady = false;
    }

    // Supprimer la partie active
    room.activeGame = undefined;
    room.status = 'waiting';
  }

  // Méthodes pour la synchronisation de l'état du jeu
  public getGameState(roomId: number): Game | null {
    const room = this.rooms.get(roomId);
    if (!room || !room.activeGame) return null;
    return room.activeGame;
  }

  public getRoomState(roomId: number): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    return room;
  }
}
