// src/lib/poker.ts
import { v4 as uuidv4 } from 'uuid';

// Types
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type Card = {
  suit: Suit;
  rank: Rank;
  value: number;
};

export type HandRank = 
  'high-card' | 
  'pair' | 
  'two-pair' | 
  'three-of-a-kind' | 
  'straight' | 
  'flush' | 
  'full-house' | 
  'four-of-a-kind' | 
  'straight-flush' | 
  'royal-flush';

export type PlayerAction = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'all-in';

export type GameStage = 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';

export type Player = {
  id: number;
  username: string;
  chips: number;
  hand: Card[];
  bet: number;
  totalBet: number;
  folded: boolean;
  isAllIn: boolean;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isActive: boolean;
  position: number;
};

export type Game = {
  id: string;
  tableId: number;
  players: Player[];
  deck: Card[];
  communityCards: Card[];
  pot: number;
  sidePots: { amount: number, eligiblePlayers: number[] }[];
  currentBet: number;
  minRaise: number;
  smallBlind: number;
  bigBlind: number;
  dealerPosition: number;
  activePlayerPosition: number;
  stage: GameStage;
  lastAction?: { playerId: number, action: PlayerAction, amount?: number };
  winners?: { playerId: number, handRank: HandRank, handValue: number, amount: number }[];
};

// Constantes
const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

// Fonctions utilitaires
export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        value: RANK_VALUES[rank]
      });
    }
  }
  
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export function dealCards(deck: Card[], numPlayers: number): { updatedDeck: Card[], playerHands: Card[][] } {
  const updatedDeck = [...deck];
  const playerHands: Card[][] = Array(numPlayers).fill(null).map(() => []);
  
  // Deal 2 cards to each player
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < numPlayers; j++) {
      const card = updatedDeck.pop();
      if (card) {
        playerHands[j].push(card);
      }
    }
  }
  
  return { updatedDeck, playerHands };
}

export function dealCommunityCards(deck: Card[], stage: GameStage, existingCommunityCards: Card[] = []): { updatedDeck: Card[], communityCards: Card[] } {
  const updatedDeck = [...deck];
  let communityCards = [...existingCommunityCards];
  
  switch (stage) {
    case 'flop':
      // Deal 3 cards for the flop
      for (let i = 0; i < 3; i++) {
        const card = updatedDeck.pop();
        if (card) {
          communityCards.push(card);
        }
      }
      break;
    case 'turn':
    case 'river':
      // Deal 1 card for turn or river
      const card = updatedDeck.pop();
      if (card) {
        communityCards.push(card);
      }
      break;
    default:
      break;
  }
  
  return { updatedDeck, communityCards };
}

// Fonctions d'évaluation des mains
export function evaluateHand(playerCards: Card[], communityCards: Card[]): { rank: HandRank, value: number } {
  const allCards = [...playerCards, ...communityCards];
  
  // Vérifier les différentes combinaisons de mains, de la plus forte à la plus faible
  const royalFlush = checkRoyalFlush(allCards);
  if (royalFlush) return { rank: 'royal-flush', value: royalFlush };
  
  const straightFlush = checkStraightFlush(allCards);
  if (straightFlush) return { rank: 'straight-flush', value: straightFlush };
  
  const fourOfAKind = checkFourOfAKind(allCards);
  if (fourOfAKind) return { rank: 'four-of-a-kind', value: fourOfAKind };
  
  const fullHouse = checkFullHouse(allCards);
  if (fullHouse) return { rank: 'full-house', value: fullHouse };
  
  const flush = checkFlush(allCards);
  if (flush) return { rank: 'flush', value: flush };
  
  const straight = checkStraight(allCards);
  if (straight) return { rank: 'straight', value: straight };
  
  const threeOfAKind = checkThreeOfAKind(allCards);
  if (threeOfAKind) return { rank: 'three-of-a-kind', value: threeOfAKind };
  
  const twoPair = checkTwoPair(allCards);
  if (twoPair) return { rank: 'two-pair', value: twoPair };
  
  const pair = checkPair(allCards);
  if (pair) return { rank: 'pair', value: pair };
  
  return { rank: 'high-card', value: checkHighCard(allCards) };
}

function checkRoyalFlush(cards: Card[]): number | null {
  // Vérifier s'il y a une quinte flush royale (10, J, Q, K, A de la même couleur)
  for (const suit of SUITS) {
    const suitCards = cards.filter(card => card.suit === suit);
    
    if (suitCards.length >= 5) {
      const hasRoyal = ['10', 'J', 'Q', 'K', 'A'].every(rank => 
        suitCards.some(card => card.rank === rank)
      );
      
      if (hasRoyal) {
        return 900; // Valeur arbitraire élevée pour la quinte flush royale
      }
    }
  }
  
  return null;
}

function checkStraightFlush(cards: Card[]): number | null {
  // Vérifier s'il y a une quinte flush (5 cartes consécutives de la même couleur)
  for (const suit of SUITS) {
    const suitCards = cards.filter(card => card.suit === suit);
    
    if (suitCards.length >= 5) {
      const straightValue = checkStraight(suitCards);
      if (straightValue !== null) {
        return 800 + straightValue; // Base + valeur de la carte haute
      }
    }
  }
  
  return null;
}

function checkFourOfAKind(cards: Card[]): number | null {
  // Vérifier s'il y a un carré (4 cartes de même valeur)
  const valueCounts = countCardValues(cards);
  
  for (const [rankStr, count] of Object.entries(valueCounts)) {
    if (count >= 4) {
      const rank = rankStr as Rank;
      return 700 + RANK_VALUES[rank]; // Base + valeur du carré
    }
  }
  
  return null;
}

function checkFullHouse(cards: Card[]): number | null {
  // Vérifier s'il y a un full house (3 cartes de même valeur + 2 cartes de même valeur)
  const valueCounts = countCardValues(cards);
  let threeOfAKindRank: Rank | null = null;
  let pairRank: Rank | null = null;
  
  // Trouver le brelan le plus élevé
  for (const [rankStr, count] of Object.entries(valueCounts)) {
    const rank = rankStr as Rank;
    if (count >= 3) {
      if (!threeOfAKindRank || RANK_VALUES[rank] > RANK_VALUES[threeOfAKindRank]) {
        threeOfAKindRank = rank;
      }
    }
  }
  
  if (!threeOfAKindRank) return null;
  
  // Trouver la paire la plus élevée
  for (const [rankStr, count] of Object.entries(valueCounts)) {
    const rank = rankStr as Rank;
    if (rank !== threeOfAKindRank && count >= 2) {
      if (!pairRank || RANK_VALUES[rank] > RANK_VALUES[pairRank]) {
        pairRank = rank;
      }
    }
  }
  
  if (!pairRank) return null;
  
  return 600 + RANK_VALUES[threeOfAKindRank] + RANK_VALUES[pairRank] / 100; // Base + valeur du brelan + valeur de la paire
}

function checkFlush(cards: Card[]): number | null {
  // Vérifier s'il y a une couleur (5 cartes de la même couleur)
  for (const suit of SUITS) {
    const suitCards = cards.filter(card => card.suit === suit);
    
    if (suitCards.length >= 5) {
      // Trier les cartes par valeur décroissante
      const sortedCards = suitCards.sort((a, b) => b.value - a.value);
      
      // Prendre les 5 cartes les plus élevées
      const topFiveCards = sortedCards.slice(0, 5);
      
      // Calculer la valeur de la main
      let value = 500; // Base pour une couleur
      for (let i = 0; i < 5; i++) {
        value += topFiveCards[i].value / Math.pow(100, i);
      }
      
      return value;
    }
  }
  
  return null;
}

function checkStraight(cards: Card[]): number | null {
  // Vérifier s'il y a une suite (5 cartes consécutives)
  const uniqueValues = [...new Set(cards.map(card => card.value))].sort((a, b) => b - a);
  
  // Cas spécial: A-5 straight (As peut être utilisé comme 1)
  if (uniqueValues.includes(14)) { // As
    let lowStraight = [5, 4, 3, 2, 1].every(value => 
      uniqueValues.includes(value) || (value === 1 && uniqueValues.includes(14))
    );
    
    if (lowStraight) {
      return 400 + 5; // Base + valeur de la carte haute (5)
    }
  }
  
  // Vérifier les suites normales
  for (let i = 0; i < uniqueValues.length - 4; i++) {
    if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
      return 400 + uniqueValues[i]; // Base + valeur de la carte haute
    }
  }
  
  return null;
}

function checkThreeOfAKind(cards: Card[]): number | null {
  // Vérifier s'il y a un brelan (3 cartes de même valeur)
  const valueCounts = countCardValues(cards);
  
  for (const [rankStr, count] of Object.entries(valueCounts)) {
    if (count >= 3) {
      const rank = rankStr as Rank;
      return 300 + RANK_VALUES[rank]; // Base + valeur du brelan
    }
  }
  
  return null;
}

function checkTwoPair(cards: Card[]): number | null {
  // Vérifier s'il y a deux paires
  const valueCounts = countCardValues(cards);
  const pairs: number[] = [];
  
  for (const [rankStr, count] of Object.entries(valueCounts)) {
    if (count >= 2) {
      const rank = rankStr as Rank;
      pairs.push(RANK_VALUES[rank]);
    }
  }
  
  if (pairs.length >= 2) {
    // Trier les paires par valeur décroissante
    pairs.sort((a, b) => b - a);
    
    // Prendre les deux paires les plus élevées
    return 200 + pairs[0] + pairs[1] / 100; // Base + valeur de la paire haute + valeur de la paire basse
  }
  
  return null;
}

function checkPair(cards: Card[]): number | null {
  // Vérifier s'il y a une paire
  const valueCounts = countCardValues(cards);
  
  for (const [rankStr, count] of Object.entries(valueCounts)) {
    if (count >= 2) {
      const rank = rankStr as Rank;
      return 100 + RANK_VALUES[rank]; // Base + valeur de la paire
    }
  }
  
  return null;
}

function checkHighCard(cards: Card[]): number {
  // Retourner la valeur de la carte la plus haute
  const sortedCards = [...cards].sort((a, b) => b.value - a.value);
  
  let value = 0;
  for (let i = 0; i < Math.min(5, sortedCards.length); i++) {
    value += sortedCards[i].value / Math.pow(100, i);
  }
  
  return value;
}

function countCardValues(cards: Card[]): Record<Rank, number> {
  const counts: Partial<Record<Rank, number>> = {};
  
  for (const card of cards) {
    counts[card.rank] = (counts[card.rank] || 0) + 1;
  }
  
  return counts as Record<Rank, number>;
}

// Fonctions de gestion du jeu
export function createGame(tableId: number, players: Player[], smallBlind: number, bigBlind: number): Game {
  const deck = shuffleDeck(createDeck());
  const dealerPosition = Math.floor(Math.random() * players.length);
  
  // Déterminer les positions des blinds
  const smallBlindPosition = (dealerPosition + 1) % players.length;
  const bigBlindPosition = (dealerPosition + 2) % players.length;
  
  // Mettre à jour les joueurs avec leurs positions et rôles
  const updatedPlayers = players.map((player, index) => ({
    ...player,
    hand: [],
    bet: 0,
    totalBet: 0,
    folded: false,
    isAllIn: false,
    isDealer: index === dealerPosition,
    isSmallBlind: index === smallBlindPosition,
    isBigBlind: index === bigBlindPosition,
    isActive: index === (bigBlindPosition + 1) % players.length, // Le joueur après la grosse blind commence
    position: index
  }));
  
  // Prélever les blinds
  updatedPlayers[smallBlindPosition].bet = smallBlind;
  updatedPlayers[smallBlindPosition].totalBet = smallBlind;
  updatedPlayers[smallBlindPosition].chips -= smallBlind;
  
  updatedPlayers[bigBlindPosition].bet = bigBlind;
  updatedPlayers[bigBlindPosition].totalBet = bigBlind;
  updatedPlayers[bigBlindPosition].chips -= bigBlind;
  
  // Distribuer les cartes
  const { updatedDeck, playerHands } = dealCards(deck, players.length);
  
  for (let i = 0; i < updatedPlayers.length; i++) {
    updatedPlayers[i].hand = playerHands[i];
  }
  
  return {
    id: uuidv4(),
    tableId,
    players: updatedPlayers,
    deck: updatedDeck,
    communityCards: [],
    pot: smallBlind + bigBlind,
    sidePots: [],
    currentBet: bigBlind,
    minRaise: bigBlind,
    smallBlind,
    bigBlind,
    dealerPosition,
    activePlayerPosition: (bigBlindPosition + 1) % players.length,
    stage: 'pre-flop'
  };
}

export function performPlayerAction(game: Game, playerId: number, action: PlayerAction, amount?: number): Game {
  const updatedGame = { ...game };
  const playerIndex = updatedGame.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1 || playerIndex !== updatedGame.activePlayerPosition || updatedGame.players[playerIndex].folded) {
    // Joueur invalide ou ce n'est pas son tour
    return game;
  }
  
  const player = { ...updatedGame.players[playerIndex] };
  
  switch (action) {
    case 'fold':
      player.folded = true;
      break;
      
    case 'check':
      if (player.bet < updatedGame.currentBet) {
        // Le joueur ne peut pas checker s'il y a une mise à suivre
        return game;
      }
      break;
      
    case 'call':
      const callAmount = Math.min(updatedGame.currentBet - player.bet, player.chips);
      player.bet += callAmount;
      player.totalBet += callAmount;
      player.chips -= callAmount;
      updatedGame.pot += callAmount;
      
      if (player.chips === 0) {
        player.isAllIn = true;
      }
      break;
      
    case 'bet':
    case 'raise':
      if (!amount || amount < updatedGame.currentBet + updatedGame.minRaise) {
        // Mise invalide
        return game;
      }
      
      const raiseAmount = Math.min(amount - player.bet, player.chips);
      player.bet += raiseAmount;
      player.totalBet += raiseAmount;
      player.chips -= raiseAmount;
      updatedGame.pot += raiseAmount;
      updatedGame.currentBet = player.bet;
      updatedGame.minRaise = player.bet - updatedGame.currentBet;
      
      if (player.chips === 0) {
        player.isAllIn = true;
      }
      break;
      
    case 'all-in':
      const allInAmount = player.chips;
      player.bet += allInAmount;
      player.totalBet += allInAmount;
      player.chips = 0;
      player.isAllIn = true;
      updatedGame.pot += allInAmount;
      
      if (player.bet > updatedGame.currentBet) {
        updatedGame.currentBet = player.bet;
        updatedGame.minRaise = player.bet - updatedGame.currentBet;
      }
      break;
  }
  
  // Mettre à jour le joueur dans la liste
  updatedGame.players[playerIndex] = player;
  
  // Enregistrer la dernière action
  updatedGame.lastAction = {
    playerId,
    action,
    amount: action === 'bet' || action === 'raise' ? player.bet : undefined
  };
  
  // Passer au joueur suivant
  updatedGame.activePlayerPosition = findNextActivePlayer(updatedGame);
  
  // Vérifier si le tour est terminé
  if (isRoundComplete(updatedGame)) {
    advanceToNextStage(updatedGame);
  }
  
  return updatedGame;
}

function findNextActivePlayer(game: Game): number {
  let nextPosition = (game.activePlayerPosition + 1) % game.players.length;
  
  // Trouver le prochain joueur qui n'a pas fold et qui n'est pas all-in
  while (
    nextPosition !== game.activePlayerPosition && 
    (game.players[nextPosition].folded || game.players[nextPosition].isAllIn)
  ) {
    nextPosition = (nextPosition + 1) % game.players.length;
  }
  
  return nextPosition;
}

function isRoundComplete(game: Game): boolean {
  // Le tour est complet si tous les joueurs ont misé le même montant ou se sont couchés ou sont all-in
  const activePlaye<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>