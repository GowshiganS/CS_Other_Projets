'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    totalEarnings: 0,
    biggestPot: 0
  });
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Simuler le chargement des données utilisateur
  useEffect(() => {
    // Dans une implémentation réelle, cela ferait une requête API
    setTimeout(() => {
      setUser({
        id: 3,
        username: 'JoueurTest',
        email: 'joueur@test.com',
        chips: 2500,
        avatar_url: null,
        created_at: '2025-01-15T10:30:00Z',
        is_admin: false
      });
      
      setStats({
        gamesPlayed: 42,
        gamesWon: 15,
        totalEarnings: 3750,
        biggestPot: 520
      });
      
      setRecentGames([
        { id: 1, date: '2025-03-23', tableId: 5, result: 'win', amount: 250, duration: '45 min' },
        { id: 2, date: '2025-03-22', tableId: 3, result: 'loss', amount: -120, duration: '30 min' },
        { id: 3, date: '2025-03-20', tableId: 7, result: 'win', amount: 180, duration: '1h 15min' },
        { id: 4, date: '2025-03-18', tableId: 2, result: 'loss', amount: -75, duration: '20 min' },
        { id: 5, date: '2025-03-15', tableId: 9, result: 'win', amount: 320, duration: '1h 30min' },
      ]);
      
      setLoading(false);
    }, 1500);
  }, []);

  const handleLogout = async () => {
    try {
      // Dans une implémentation réelle, cela ferait une requête API
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Chargement du tableau de bord</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Récupération de vos données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">PokerMaster</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-indigo-200 transition">Accueil</Link>
            <Link href="/lobby" className="hover:text-indigo-200 transition">Lobby</Link>
            <Link href="/dashboard" className="hover:text-indigo-200 transition font-semibold">Tableau de bord</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-700 px-3 py-1 rounded-full text-sm">
              {user.chips} jetons
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-indigo-800 text-white hover:bg-indigo-900 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profil utilisateur */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-indigo-200 rounded-full flex items-center justify-center text-3xl text-indigo-600 font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Membre depuis {new Date(user.created_at).toLocaleDateString()}</p>
              
              <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="/profile" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  Modifier le profil
                </Link>
                <Link href="/lobby" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  Jouer maintenant
                </Link>
              </div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-indigo-800">Solde actuel</h3>
              <p className="text-3xl font-bold text-indigo-600">{user.chips} <span className="text-sm font-normal">jetons</span></p>
              <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition w-full">
                Acheter des jetons
              </button>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historique des parties
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Statistiques
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div>
            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Parties jouées</p>
                    <p className="text-2xl font-semibold">{stats.gamesPlayed}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Parties gagnées</p>
                    <p className="text-2xl font-semibold">{stats.gamesWon}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Gains totaux</p>
                    <p className="text-2xl font-semibold">{stats.totalEarnings}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Plus gros pot</p>
                    <p className="text-2xl font-semibold">{stats.biggestPot}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Parties récentes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Parties récentes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Résultat
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durée
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentGames.map((game) => (
                      <tr key={game.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {game.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Table #{game.tableId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            game.result === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {game.result === 'win' ? 'Victoire' : 'Défaite'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={game.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                            {game.amount > 0 ? '+' : ''}{game.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {game.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Voir tout l'historique
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Historique complet des parties</h2>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Tous les résultats</option>
                  <option>Victoires</option>
                  <option>Défaites</option>
                </select>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Tous les mois</option>
                  <option>Mars 2025</option>
                  <option>Février 2025</option>
                  <option>Janvier 2025</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Résultat
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
               <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>