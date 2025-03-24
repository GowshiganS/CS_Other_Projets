export const metadata = {
  title: 'PokerMaster - Jeu de Poker en Ligne',
  description: 'Jouez au poker Texas Hold\'em en ligne avec des joueurs du monde entier',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
