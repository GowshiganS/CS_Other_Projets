-- Schéma de base de données pour le site de poker en ligne

-- Table des utilisateurs
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  chips INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Table des tables de poker
CREATE TABLE poker_tables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 6,
  small_blind INTEGER NOT NULL,
  big_blind INTEGER NOT NULL,
  min_buy_in INTEGER NOT NULL,
  max_buy_in INTEGER NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  password TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'waiting' -- waiting, active, completed
);

-- Table des parties de poker
CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id INTEGER NOT NULL,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed
  FOREIGN KEY (table_id) REFERENCES poker_tables(id)
);

-- Table des joueurs dans une partie
CREATE TABLE game_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  seat_position INTEGER NOT NULL,
  chips_amount INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  current_bet INTEGER DEFAULT 0,
  is_dealer BOOLEAN DEFAULT FALSE,
  is_small_blind BOOLEAN DEFAULT FALSE,
  is_big_blind BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(game_id, seat_position),
  UNIQUE(game_id, user_id)
);

-- Table des mains de poker (rounds)
CREATE TABLE hands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  community_cards TEXT, -- Stocké au format JSON: ["♥A", "♦K", "♣Q", "♠J", "♥10"]
  pot INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pre_flop', -- pre_flop, flop, turn, river, completed
  winner_id INTEGER,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (winner_id) REFERENCES game_players(id)
);

-- Table des cartes des joueurs
CREATE TABLE player_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hand_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  cards TEXT NOT NULL, -- Stocké au format JSON: ["♥A", "♦K"]
  FOREIGN KEY (hand_id) REFERENCES hands(id),
  FOREIGN KEY (player_id) REFERENCES game_players(id)
);

-- Table des actions des joueurs
CREATE TABLE player_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hand_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- fold, check, call, bet, raise
  amount INTEGER,
  action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hand_id) REFERENCES hands(id),
  FOREIGN KEY (player_id) REFERENCES game_players(id)
);

-- Table des transactions
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- deposit, withdrawal, win, loss, buy_in
  reference_id INTEGER, -- ID de la partie ou de la main concernée
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des messages de chat
CREATE TABLE chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des statistiques des joueurs
CREATE TABLE player_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  biggest_pot INTEGER DEFAULT 0,
  hands_played INTEGER DEFAULT 0,
  hands_won INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_games_table_id ON games(table_id);
CREATE INDEX idx_game_players_game_id ON game_players(game_id);
CREATE INDEX idx_game_players_user_id ON game_players(user_id);
CREATE INDEX idx_hands_game_id ON hands(game_id);
CREATE INDEX idx_player_cards_hand_id ON player_cards(hand_id);
CREATE INDEX idx_player_actions_hand_id ON player_actions(hand_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_chat_messages_game_id ON chat_messages(game_id);
