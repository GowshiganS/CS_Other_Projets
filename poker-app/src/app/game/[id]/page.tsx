'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, getCardDisplay } from '@/lib/poker';

export default function GameInterface({ params }: { params: { id: string } }) {
  const tableId = params.id;
  
  // États pour le jeu
  const [gameState, setGameState] = useState<any>(null);
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // Simuler la connexion et l'état du jeu pour la démo
  useEffect(() => {
    // Simuler un délai de connexion
    const timer = setTimeout(() => {
      setIsConnected(true);
      
      // Données fictives pour la démo
      const mockGameState = {
        id: 'game-123',
        tableId: parseInt(tableId),
        pot: 240,
        currentBet: 20,
        stage: 'flop',
        communityCards: [
          { suit: 'hearts', rank: '10', value: 10 },
          { suit: 'diamonds', rank: 'J', value: 11 },
          { suit: 'clubs', rank: 'K', value: 13 }
        ],
        players: [
          { id: 1, username: 'Joueur 1', chips: 1500, position: 0, isDealer: true, isSmallBlind: false, isBigBlind: false, bet: 0, folded: false, isActive: false },
          { id: 2, username: 'Joueur 2', chips: 2200, position: 1, isDealer: false, isSmallBlind: true, isBigBlind: false, bet: 10, folded: false, isActive: false },
          { id: 3, username: 'Vous', chips: 1800, position: 2, isDealer: false, isSmallBlind: false, isBigBlind: true, bet: 20, folded: false, isActive: true, hand: [
            { suit: 'spades', rank: 'Q', value: 12 },
            { suit: 'spades', rank: 'J', value: 11 }
          ]},
          { id: 4, username: 'Joueur 4', chips: 900, position: 3, isDealer: false, isSmallBlind: false, isBigBlind: false, bet: 0, folded: true, isActive: false },
          { id: 5, username: 'Joueur 5', chips: 3000, position: 4, isDealer: false, isSmallBlind: false, isBigBlind: false, bet: 20, folded: false, isActive: false }
        ]
      };
      
      setGameState(mockGameState);
      setCurrentPlayer(mockGameState.players.find((p: any) => p.username === 'Vous'));
      
      // Messages de chat fictifs
      setChatMessages([
        { userId: 1, username: 'Joueur 1', message: 'Bonne chance à tous !', timestamp: Date.now() - 5000 },
        { userId: 2, username: 'Joueur 2', message: 'Merci, à toi aussi !', timestamp: Date.now() - 3000 },
        { userId: 5, username: 'Joueur 5', message: 'Je sens que je vais gagner cette main 😎', timestamp: Date.now() - 1000 }
      ]);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [tableId]);
  
  // Calculer le montant minimum pour suivre et relancer
  const minCallAmount = gameState?.currentBet || 0;
  const minRaiseAmount = minCallAmount * 2;
  
  // Gérer les actions du joueur
  const handleAction = (action: string) => {
    if (!gameState || !currentPlayer) return;
    
    console.log(`Action: ${action}, Amount: ${betAmount}`);
    
    // Simuler une mise à jour de l'état du jeu
    // Dans une implémentation réelle, cela enverrait l'action au serveur via socket
  };
  
  // Envoyer un message de chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    // Ajouter le message à la liste
    setChatMessages([
      ...chatMessages,
      { userId: currentPlayer?.id, username: 'Vous', message: chatInput, timestamp: Date.now() }
    ]);
    
    // Réinitialiser l'entrée
    setChatInput('');
    
    // Dans une implémentation réelle, cela enverrait le message au serveur via socket
  };
  
  // Afficher l'écran de chargement
  if (!isConnected || !gameState) {
    return (
      <div className="min-h-screen bg-green-800 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Connexion à la table #{tableId}</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Préparation de la table de poker...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-green-800 text-white">
      {/* Header */}
      <header className="bg-green-900 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Table #{tableId}</h1>
            <div className="ml-4 px-3 py-1 bg-yellow-600 rounded-full text-sm">
              Blindes: {gameState.players.find((p: any) => p.isSmallBlind)?.bet}/{gameState.players.find((p: any) => p.isBigBlind)?.bet}
            </div>
          </div>
          <div className="flex space-x-4">
            <Link href="/lobby" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
              Quitter la table
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Table de poker */}
        <div className="lg:w-3/4">
          <div className="relative w-full h-[500px] bg-green-700 rounded-full border-8 border-brown-800 mb-8">
            {/* Pot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-20 bg-yellow-600 px-4 py-2 rounded-full text-lg font-bold">
              Pot: {gameState.pot}
            </div>
            
            {/* Cartes communautaires */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-10 flex space-x-2">
              {gameState.communityCards.map((card: Card, index: number) => (
                <div key={index} className="w-16 h-24 bg-white text-black rounded-lg shadow-lg flex items-center justify-center font-bold text-xl">
                  <span className={card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-black'}>
                    {getCardDisplay(card)}
                  </span>
                </div>
              ))}
              {Array(5 - gameState.communityCards.length).fill(0).map((_, index) => (
                <div key={`empty-${index}`} className="w-16 h-24 bg-gray-300 bg-opacity-20 rounded-lg border border-white border-opacity-20"></div>
              ))}
            </div>
            
            {/* Positions des joueurs */}
            {gameState.players.map((player: any) => {
              // Calculer la position sur le cercle
              const angle = (player.position / gameState.players.length) * 2 * Math.PI;
              const radius = 200; // Rayon du cercle
              const left = 50 + 40 * Math.sin(angle);
              const top = 50 - 40 * Math.cos(angle);
              
              return (
                <div 
                  key={player.id} 
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${player.folded ? 'opacity-50' : ''} ${player.isActive ? 'ring-2 ring-yellow-400' : ''}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
                    <div className="text-center font-bold">{player.username}</div>
                    <div className="text-center text-sm">{player.chips}</div>
                    
                    {/* Indicateurs de rôle */}
                    <div className="flex justify-center space-x-1 mt-1">
                      {player.isDealer && (
                        <div className="bg-white text-black text-xs px-2 py-0.5 rounded-full">D</div>
                      )}
                      {player.isSmallBlind && (
                        <div className="bg-blue-600 text-xs px-2 py-0.5 rounded-full">SB</div>
                      )}
                      {player.isBigBlind && (
                        <div className="bg-red-600 text-xs px-2 py-0.5 rounded-full">BB</div>
                      )}
                    </div>
                    
                    {/* Mise actuelle */}
                    {player.bet > 0 && (
                      <div className="mt-2 bg-yellow-600 text-xs px-2 py-1 rounded-full text-center">
                        {player.bet}
                      </div>
                    )}
                    
                    {/* Cartes du joueur (seulement pour le joueur actuel) */}
                    {player.hand && (
                      <div className="flex justify-center space-x-1 mt-2">
                        {player.hand.map((card: Card, index: number) => (
                          <div key={index} className="w-8 h-12 bg-white text-black rounded-sm shadow flex items-center justify-center text-xs font-bold">
                            <span className={card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-black'}>
                              {getCardDisplay(card)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Cartes face cachée pour les autres joueurs */}
                    {!player.folded && !player.hand && (
                      <div className="flex justify-center space-x-1 mt-2">
                        <div className="w-8 h-12 bg-red-600 rounded-sm shadow"></div>
                        <div className="w-8 h-12 bg-red-600 rounded-sm shadow"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Actions du joueur */}
          {currentPlayer?.isActive && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  {currentPlayer.hand?.map((card: Card, index: number) => (
                    <div key={index} className="w-16 h-24 bg-white text-black rounded-lg shadow-lg flex items-center justify-center font-bold text-xl">
                      <span className={card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-black'}>
                        {getCardDisplay(card)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-xl font-bold">
                  Vos jetons: {currentPlayer.chips}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleAction('fold')}
                  className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-bold"
                >
                  Se coucher
                </button>
                
                {gameState.currentBet === currentPlayer.bet && (
                  <button 
                    onClick={() => handleAction('check')}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold"
                  >
                    Checker
                  </button>
                )}
                
                {gameState.currentBet > currentPlayer.bet && (
                  <button 
                    onClick={() => handleAction('call')}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold"
                  >
                    Suivre ({gameState.currentBet - currentPlayer.bet})
                  </button>
                )}
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleAction('raise')}
                    className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded font-bold"
                    disabled={currentPlayer.chips <= minRaiseAmount}
                  >
                    Relancer
                  </button>
                  <input 
                    type="number" 
                    className="w-24 px-2 py-2 rounded text-black" 
                    placeholder="Montant"
                    min={minRaiseAmount}
                    max={currentPlayer.chips}
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  />
                </div>
                
                <button 
                  onClick={() => handleAction('all-in')}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-bold"
                >
                  Tapis ({currentPlayer.chips})
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat et infos */}
        <div className="lg:w-1/4">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[500px] flex flex-col">
            <div className="bg-gray-900 p-3">
              <h3 className="font-bold">Chat de table</h3>
            </div>
            
            <div className="flex-grow p-3 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <div className="flex items-start">
                    <span className="font-bold text-indigo-400">{msg.username}: </span>
                    <span className="ml-1 text-gray-300">{msg.message}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 bg-gray-900 border-t border-gray-700">
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-grow px-3 py-2 rounded-l text-black" 
                  placeholder="Envoyer un message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
          
          {/* Infos de jeu */}
          <div className="mt-4 bg-gray-800 rounded-lg shadow-lg p-4">
            <h3 className="font-bold mb-2">Informations</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Phase:</span>
                <span className="font-semibold">
                  {gameState.stage === 'pre-flop' ? 'Pré-flop' : 
                   gameState.stage === 'flop' ? 'Flop' : 
                   gameState.stage === 'turn' ? 'Turn' : 
                   gameState.stage === 'river' ? 'River' : 'Abattage'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Mise actuelle:</span>
                <span className="font-semibold">{gameState.currentBet}</span>
              </div>
              <div className="flex justify-between">
                <span>Pot:</span>
                <span className="font-semibold">{gameState.pot}</span>
              </div>
              <div className="flex justify-between">
                <span>Joueurs actifs:</span>
                <span className="font-semibold">
                  {gameState.players.filter((p: any) => !p.folded).length}/{gameState.players.length}
                </span>
  <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>