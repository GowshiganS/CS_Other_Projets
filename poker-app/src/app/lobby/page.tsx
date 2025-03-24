import React from 'react';
import Link from 'next/link';

export default function Lobby() {
  // Données fictives pour les tables de poker
  const tables = [
    { id: 1, name: 'Table Débutant', players: 3, maxPlayers: 6, blinds: '1/2', avgPot: '50€' },
    { id: 2, name: 'Table Intermédiaire', players: 5, maxPlayers: 8, blinds: '2/5', avgPot: '120€' },
    { id: 3, name: 'Table Expert', players: 4, maxPlayers: 6, blinds: '5/10', avgPot: '300€' },
    { id: 4, name: 'Table VIP', players: 2, maxPlayers: 4, blinds: '10/20', avgPot: '500€' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Lobby Poker</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Tables disponibles</h2>
                </div>
                <div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Créer une table
                  </button>
                </div>
              </div>
              
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Nom de la table
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Joueurs
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Blinds
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Pot moyen
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Rejoindre</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {tables.map((table) => (
                      <tr key={table.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {table.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {table.players}/{table.maxPlayers}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {table.blinds}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {table.avgPot}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/game/${table.id}`} className="text-indigo-600 hover:text-indigo-900">
                            Rejoindre<span className="sr-only">, {table.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
