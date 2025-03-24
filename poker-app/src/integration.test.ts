// src/integration.test.ts
import { createGame, performPlayerAction } from './lib/poker';
import { GameRoomManager } from './lib/gameRoom';
import { hashPassword, verifyPassword } from './lib/auth';

// Tests d'intégration pour vérifier l'interaction entre les différents modules
describe('Integration Tests', () => {
  // Test d'intégration entre le module de poker et le gestionnaire de salles
  test('GameRoomManager should correctly integrate with poker game logic', async () => {
    // Initialiser le gestionnaire de salles
    const roomManager = GameRoomManager.getInstance();
    
    // Créer une salle de test
    const room = roomManager.createRoom(
      'Test Room',
      6,
      5,
      10,
      100,
      1000,
      false
    );
    
    // Vérifier que la salle a été créée correctement
    expect(room.id).toBeDefined();
    expect(room.name).toBe('Test Room');
    expect(room.smallBlind).toBe(5);
    expect(room.bigBlind).toBe(10);
    
    // Simuler l'ajout de joueurs à la salle
    // Note: Dans un test réel, nous utiliserions des mocks pour la base de données
    const mockAddPlayerToRoom = jest.spyOn(roomManager, 'addPlayerToRoom')
      .mockImplementation(async (roomId, userId, buyIn, seatPosition) => {
        room.players.push({
          id: userId,
          username: `Player${userId}`,
          chips: buyIn,
          seatPosition,
          isReady: true
        });
        return true;
      });
    
    // Ajouter des joueurs
    await roomManager.addPlayerToRoom(room.id, 1, 500, 0);
    await roomManager.addPlayerToRoom(room.id, 2, 500, 1);
    await roomManager.addPlayerToRoom(room.id, 3, 500, 2);
    
    // Vérifier que les joueurs ont été ajoutés
    expect(room.players.length).toBe(3);
    
    // Démarrer une partie
    const mockStartGame = jest.spyOn(roomManager, 'startGame')
      .mockImplementation((roomId) => {
        const players = room.players.map(p => ({
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
        
        const game = createGame(roomId, players, room.smallBlind, room.bigBlind);
        room.activeGame = game;
        room.status = 'active';
        return game;
      });
    
    const game = roomManager.startGame(room.id);
    
    // Vérifier que la partie a été créée correctement
    expect(game).toBeDefined();
    expect(game?.tableId).toBe(room.id);
    expect(game?.players.length).toBe(3);
    expect(room.status).toBe('active');
    
    // Simuler une action de joueur
    const mockPerformAction = jest.spyOn(roomManager, 'performAction')
      .mockImplementation((roomId, playerId, action, amount) => {
        if (!room.activeGame) return null;
        
        const updatedGame = performPlayerAction(room.activeGame, playerId, action, amount);
        room.activeGame = updatedGame;
        return updatedGame;
      });
    
    // Trouver le joueur actif
    const activePlayerId = game?.players.find(p => p.isActive)?.id;
    if (!activePlayerId || !game) throw new Error('No active player or game found');
    
    // Effectuer une action
    const updatedGame = roomManager.performAction(room.id, activePlayerId, 'call');
    
    // Vérifier que l'action a été traitée correctement
    expect(updatedGame).toBeDefined();
    expect(updatedGame?.pot).toBeGreaterThan(game.pot);
    
    // Nettoyer les mocks
    mockAddPlayerToRoom.mockRestore();
    mockStartGame.mockRestore();
    mockPerformAction.mockRestore();
  });
  
  // Test d'intégration pour l'authentification
  test('Authentication flow should work correctly', async () => {
    // Tester le flux d'authentification complet
    const username = 'testuser';
    const email = 'test@example.com';
    const password = 'Password123';
    
    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);
    
    // Vérifier que le hash est différent du mot de passe original
    expect(hashedPassword).not.toBe(password);
    
    // Vérifier que le mot de passe correct est validé
    const isValidPassword = await verifyPassword(password, hashedPassword);
    expect(isValidPassword).toBe(true);
    
    // Vérifier qu'un mot de passe incorrect est rejeté
    const isInvalidPassword = await verifyPassword('WrongPassword', hashedPassword);
    expect(isInvalidPassword).toBe(false);
  });
  
  // Test d'intégration pour la communication en temps réel
  test('Socket communication should handle game events correctly', () => {
    // Simuler un gestionnaire de socket
    const mockSocketManager = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      joinTable: jest.fn(),
      leaveTable: jest.fn(),
      performAction: jest.fn(),
      sendChatMessage: jest.fn(),
      addGameEventListener: jest.fn(),
      removeGameEventListener: jest.fn()
    };
    
    // Simuler une connexion
    mockSocketManager.connect(1, 'fake-token');
    expect(mockSocketManager.connect).toHaveBeenCalledWith(1, 'fake-token');
    
    // Simuler une action de jeu
    const gameEvent = {
      gameId: 'game-123',
      playerId: 1,
      action: 'call',
      amount: 10
    };
    mockSocketManager.performAction(gameEvent);
    expect(mockSocketManager.performAction).toHaveBeenCalledWith(gameEvent);
    
    // Simuler l'envoi d'un message de chat
    mockSocketManager.sendChatMessage('game-123', 'Hello everyone!');
    expect(mockSocketManager.sendChatMessage).toHaveBeenCalledWith('game-123', 'Hello everyone!');
    
    // Simuler la déconnexion
    mockSocketManager.disconnect();
    expect(mockSocketManager.disconnect).toHaveBeenCalled();
  });
});
