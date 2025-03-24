'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header/Navigation */}
      <header className="bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-500">PokerMaster</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-indigo-400 transition">Accueil</Link>
            <Link href="#features" className="hover:text-indigo-400 transition">Fonctionnalités</Link>
            <Link href="#how-to-play" className="hover:text-indigo-400 transition">Comment jouer</Link>
            <Link href="#faq" className="hover:text-indigo-400 transition">FAQ</Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="/auth/login" className="px-4 py-2 rounded border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition">
              Connexion
            </Link>
            <Link href="/auth/register" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">
              Inscription
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Le Poker en Ligne à son Meilleur</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Rejoignez des milliers de joueurs et vivez l'expérience du poker Texas Hold'em dans un environnement sécurisé et convivial.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/auth/register" className="px-8 py-4 rounded-lg bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 transition">
              Commencer à jouer
            </Link>
            <Link href="#how-to-play" className="px-8 py-4 rounded-lg bg-gray-700 text-white text-lg font-semibold hover:bg-gray-600 transition">
              Découvrir le jeu
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pourquoi choisir PokerMaster ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Multijoueur en Temps Réel</h3>
              <p className="text-gray-300 text-center">
                Jouez avec des amis ou des adversaires du monde entier dans des parties en temps réel avec chat intégré.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Sécurité Garantie</h3>
              <p className="text-gray-300 text-center">
                Profitez d'un environnement de jeu sécurisé avec authentification robuste et protection des données.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Interface Intuitive</h3>
              <p className="text-gray-300 text-center">
                Une interface élégante et facile à utiliser, optimisée pour tous les appareils, du mobile au desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section id="how-to-play" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Comment Jouer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold">Créez votre compte</h3>
                </div>
                <p className="text-gray-300 pl-14">
                  Inscrivez-vous gratuitement et recevez des jetons de bienvenue pour commencer à jouer.
                </p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold">Rejoignez une table</h3>
                </div>
                <p className="text-gray-300 pl-14">
                  Parcourez les tables disponibles et choisissez celle qui correspond à votre niveau et à votre budget.
                </p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold">Jouez votre main</h3>
                </div>
                <p className="text-gray-300 pl-14">
                  Recevez vos cartes, analysez votre jeu et prenez des décisions stratégiques pour remporter le pot.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-semibold">Gagnez des jetons</h3>
                </div>
                <p className="text-gray-300 pl-14">
                  Améliorez vos compétences, gagnez des jetons et grimpez dans le classement des meilleurs joueurs.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <p className="text-xl font-semibold mb-2">Vidéo tutoriel</p>
                  <p className="text-gray-400">Apprenez les bases du Texas Hold'em</p>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Règles du Texas Hold'em</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• Chaque joueur reçoit 2 cartes privées</li>
                  <li>• 5 cartes communes sont révélées en 3 tours</li>
                  <li>• Formez la meilleure main de 5 cartes possible</li>
                  <li>• Misez, suivez, relancez ou passez à chaque tour</li>
                  <li>• Le joueur avec la meilleure main remporte le pot</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Questions Fréquentes</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Est-ce que je peux jouer gratuitement ?</h3>
              <p className="text-gray-300">
                Oui, vous recevez des jetons gratuits lors de votre inscription et des bonus quotidiens pour continuer à jouer sans dépenser d'argent réel.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Comment fonctionne le classement des joueurs ?</h3>
              <p className="text-gray-300">
                Le classement est basé sur vos performances, vos gains et le nombre de parties jouées. Gagnez des parties pour grimper dans le classement !
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Puis-je créer des tables privées pour jouer avec mes amis ?</h3>
              <p className="text-gray-300">
                Absolument ! Vous pouvez créer des tables privées protégées par mot de passe et inviter vos amis à vous rejoindre pour des parties exclusives.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Le site est-il accessible sur mobile ?</h3>
              <p className="text-gray-300">
                Oui, notre plateforme est entièrement responsive et optimisée pour tous les appareils, vous permettant de jouer où que vous soyez.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-indigo-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à rejoindre la table ?</h2>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Inscrivez-vous maintenant et recevez 1000 jetons gratuits pour commencer votre aventure poker !
          </p>
          <Link href="/auth/register" className="px-8 py-4 rounded-lg bg-white text-indigo-900 text-lg font-semibold hover:bg-gray-100 transition">
            Créer un compte gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-indigo-500 mb-4">PokerMaster</h3>
              <p className="text-gray-400">
                La meilleure plateforme de poker en ligne pour les joueurs de tous niveaux.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-indigo-400 transition">Accueil</Link></li>
                <li><Link href="#features" className="hover:text-indigo-400 transition">Fonctionnalités</Link></li>
                <li><Link href="#how-to-play" className="hover:text-indigo-400 transition">Comment jouer</Link></li>
                <li><Link href="#faq" className="hover:text-indigo-400 transition">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-indigo-400 transition">Conditions d'utilisation</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition">Politique de confidentialité</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition">Jeu responsable</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@pokermaster.com</li>
                <li>+33 1 23 45 67 89</li>
                <li>
                  <div className="flex space-x-4 mt-4">
                    <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>