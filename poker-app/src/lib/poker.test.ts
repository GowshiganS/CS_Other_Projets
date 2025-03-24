// src/lib/poker.test.ts
import { 
  createDeck, 
  shuffleDeck, 
  dealCards, 
  dealCommunityCards, 
  evaluateHand, 
  createGame, 
  performPlayerAction 
} from './poker';

describe('Poker Game Logic', () => {
  // Test de création du jeu de cartes
  test('createDeck should return a deck with 52 cards', () => {
    const deck = createDeck();
    expect(deck.length).toBe(52);
    
    // Vérifier que toutes les cartes sont uniques
    const uniqueCards = new Set(deck.map(card => `${card.suit}-${card.rank}`));
    expect(uniqueCards.size).toBe(52);
  });
  
  // Test de mélange du jeu de cartes
  test('shuffleDeck should return a shuffled deck with the same cards', () => {
    const originalDeck = createDeck();
    const shuffledDeck = shuffleDeck(originalDeck);
    
    // Vérifier que le jeu mélangé a le même nombre de cartes
    expect(shuffledDeck.length).toBe(originalDeck.length);
    
    // Vérifier que toutes les cartes sont présentes dans le jeu mélangé
    const originalCards = originalDeck.map(card => `${card.suit}-${card.rank}`).sort();
    const shuffledCards = shuffledDeck.map(card => `${card.suit}-${card.rank}`).sort();
    expect(shuffledCards).toEqual(originalCards);
    
    // Vérifier que le jeu est effectivement mélangé (peut échouer rarement si le hasard donne le même ordre)
    const originalOrder = originalDeck.map(card => `${card.suit}-${card.rank}`).join(',');
    const shuffledOrder = shuffledDeck.map(card => `${card.suit}-${card.rank}`).join(',');
    expect(shuffledOrder).not.toEqual(originalOrder);
  });
  
  // Test de distribution des cartes
  test('dealCards should deal 2 cards to each player', () => {
    const deck = createDeck();
    const numPlayers = 4;
    const { updatedDeck, playerHands } = dealCards(deck, numPlayers);
    
    // Vérifier que chaque joueur a 2 cartes
    expect(playerHands.length).toBe(numPlayers);
    playerHands.forEach(hand => {
      expect(hand.length).toBe(2);
    });
    
    // Vérifier que le jeu restant a le bon nombre de cartes
    expect(updatedDeck.length).toBe(deck.length - (numPlayers * 2));
  });
  
  // Test de distribution des cartes communes
  test('dealCommunityCards should deal correct number of cards for each stage', () => {
    const deck = createDeck();
    
    // Test du flop (3 cartes)
    const flopResult = dealCommunityCards(deck, 'flop');
    expect(flopResult.communityCards.length).toBe(3);
    expect(flopResult.updatedDeck.length).toBe(deck.length - 3);
    
    // Test du turn (1 carte supplémentaire)
    const turnResult = dealCommunityCards(flopResult.updatedDeck, 'turn', flopResult.communityCards);
    expect(turnResult.communityCards.length).toBe(4);
    expect(turnResult.updatedDeck.length).toBe(flopResult.updatedDeck.length - 1);
    
    // Test de la river (1 carte supplémentaire)
    const riverResult = dealCommunityCards(turnResult.updatedDeck, 'river', turnResult.communityCards);
    expect(riverResult.communityCards.length).toBe(5);
    expect(riverResult.updatedDeck.length).toBe(turnResult.updatedDeck.length - 1);
  });
  
  // Test d'évaluation des mains
  test('evaluateHand should correctly identify poker hands', () => {
    // Test d'une paire
    const pairHand = [
      { suit: 'hearts', rank: 'A', value: 14 },
      { suit: 'clubs', rank: 'A', value: 14 }
    ];
    const communityCards = [
      { suit: 'diamonds', rank: '5', value: 5 },
      { suit: 'spades', rank: '8', value: 8 },
      { suit: 'hearts', rank: 'J', value: 11 },
      { suit: 'clubs', rank: '2', value: 2 },
      { suit: 'diamonds', rank: 'K', value: 13 }
    ];
    
    const result = evaluateHand(pairHand, communityCards);
    expect(result.rank).toBe('pair');
    
    // Test d'une couleur
    const flushHand = [
      { suit: 'hearts', rank: 'A', value: 14 },
      { suit: 'hearts', rank: '5', value: 5 }
    ];
    const flushCommunity = [
      { suit: 'hearts', rank: '7', value: 7 },
      { suit: 'hearts', rank: '8', value: 8 },
      { suit: 'hearts', rank: 'J', value: 11 },
      { suit: 'clubs', rank: '2', value: 2 },
      { suit: 'diamonds', rank: 'K', value: 13 }
    ];
    
    const flushResult = evaluateHand(flushHand, flushCommunity);
    expect(flushResult.rank).toBe('flush');
  });
  
  // Test de création d'une partie
  test('createGame should initialize a game with correct state', () => {
    const tableId = 1;
    const players = [
      { id: 1, username: 'Player1', chips: 1000, hand: [], bet: 0, totalBet: 0, folded: false, isAllIn: false, isDealer: false, isSmallBlind: false, isBigBlind: false, isActive: false, position: 0 },
      { id: 2, username: 'Player2', chips: 1000, hand: [], bet: 0, totalBet: 0, folded: false, isAllIn: false, isDealer: false, isSmallBlind: false, isBigBlind: false, isActive: false, position: 1 },
      { id: 3, username: 'Player3', chips: 1000, hand: [], bet: 0, totalBet: 0, folded: false, isAllIn: false, isDealer: false, isSmallBlind: false, isBigBlind: false, isActive: false, position: 2 }
    ];
    const smallBlind = 5;
    const bigBlind = 10;
    
    const game = createGame(tableId, players, smallBlind, bigBlind);
    
    // Vérifier les propriétés de base du jeu
    expect(game.tableId).toBe(tableId);
    expect(game.players.length).toBe(players.length);
    expect(game.smallBlind).toBe(smallBlind);
    expect(game.bigBlind).toBe(bigBlind);
    expect(game.pot).toBe(smallBlind + bigBlind);
    expect(game.stage).toBe('pre-flop');
    expect(game.communityCards.length).toBe(0);
    
    // Vérifier que les blinds ont été prélevées
    const smallBlindPlayer = game.players.find(p => p.isSmallBlind);
    const bigBlindPlayer = game.players.find(p => p.isBigBlind);
    expect(smallBlindPlayer?.bet).toBe(smallBlind);
    expect(bigBlindPlayer?.bet).toBe(bigBlind);
    
    // Vérifier que chaque joueur a 2 cartes
    game.players.forEach(player => {
      expect(player.hand.length).toBe(2);
    });
  });
  
  // Test des actions des joueurs
  test('performPlayerAction should update game state correctly', () => {
    // Créer une partie de test
    const tableId = 1;
    const players = [
      { id: 1, username: 'Player1', chips: 1000, hand: [], bet: 0, totalBet: 0, folded: false, isAllIn: false, isDealer: true, isSmallBlind: false, isBigBlind: false, isActive: false, position: 0 },
      { id: 2, username: 'Player2', chips: 1000, hand: [], bet: 5, totalBet: 5, folded: false, isAllIn: false, isDealer: false, isSmallBlind: true, isBigBlind: false, isActive: false, position: 1 },
      { id: 3, username: 'Player3', chips: 1000, hand: [], bet: 10, totalBet: 10, folded: false, isAllIn: false, isDealer: false, isSmallBlind: false, isBigBlind: true, isActive: false, position: 2 },
      { id: 4, username: 'Player4', chips: 1000, hand: [], bet: 0, totalBet: 0, folded: false, isAllIn: false, isDealer: false, isSmallBlind: false, isBigBlind: false, isActive: true, position: 3 }
    ];
    const smallBlind = 5;
    const bigBlind = 10;
    
    let game = createGame(tableId, players, smallBlind, bigBlind);
    
    // Simuler une action de call
    const activePlayerId = game.players.find(p => p.isActive)?.id;
    if (!activePlayerId) throw new Error('No active player found');
    
    game = performPlayerAction(game, activePlayerId, 'call');
    
    // Vérifier que le joueur a suivi la mise
    const updatedPlayer = game.players.find(p => p.id === activePlayerId);
    expect(updatedPlayer?.bet).toBe(bigBlind);
    expect(game.pot).toBe(smallBlind + bigBlind + bigBlind);
    
    // Vérifier que c'est au tour du joueur suivant
    expect(game.activePlayerPosition).not.toBe(3);
  });
});
