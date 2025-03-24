'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Composant qui utilise useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simuler une connexion réussie pour la démo
      console.log('Tentative de connexion avec:', { email, password });
      
      // Dans une implémentation réelle, cela ferait une requête API
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <Link href="/auth/register" className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800">
            Créer un compte
          </Link>
        </div>
      </form>
      
      <p className="text-center text-gray-500 text-xs">
        &copy; 2025 PokerMaster. Tous droits réservés.
      </p>
    </div>
  );
}

// Page principale avec Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">PokerMaster</h1>
        <p className="text-gray-600">Connectez-vous pour accéder à votre compte</p>
      </div>
      
      <Suspense fallback={<div>Chargement...</div>}>
        <LoginForm />
      </Suspense>
      
      <div className="mt-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800">
          &larr; Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
