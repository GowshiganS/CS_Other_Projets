'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Fonction pour récupérer les données de l'utilisateur
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
        } else {
          // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
          router.push('/auth/login');
        }
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/auth/login');
      }
    } catch (err) {
      setError('Erreur lors de la déconnexion');
      console.error(err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Chargement du profil...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null; // La redirection sera gérée dans useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Profil Utilisateur</h1>
            <div className="flex space-x-2">
              <Link href="/lobby" className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium">
                Retour au Lobby
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-3xl text-gray-600">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Jetons disponibles</h3>
                <p className="text-3xl font-bold">{user.chips} €</p>
                <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Acheter des jetons
                </button>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Statistiques</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Parties jouées:</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parties gagnées:</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gains totaux:</span>
                    <span className="font-semibold">0 €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-6 pt-4">
            <h3 className="font-semibold text-lg mb-4">Paramètres du compte</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={user.username}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={user.email}
                />
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="new-password"
                  name="newPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Mettre à jour le profil
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
