// src/lib/db.ts
import { D1Database } from '@cloudflare/workers-types';

declare global {
  var DB: D1Database;
}

export async function initializeDatabase() {
  try {
    // Vérifier si la base de données est initialisée
    const result = await global.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    ).all();
    
    if (!result.results || result.results.length === 0) {
      console.log("Initialisation de la base de données...");
      
      // Lire et exécuter le fichier de migration
      const fs = require('fs');
      const path = require('path');
      const sqlPath = path.join(process.cwd(), 'migrations', '0001_initial.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      // Diviser le fichier SQL en instructions individuelles
      const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
      
      // Exécuter chaque instruction
      for (const statement of statements) {
        await global.DB.prepare(statement + ';').run();
      }
      
      console.log("Base de données initialisée avec succès");
    } else {
      console.log("Base de données déjà initialisée");
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
    return false;
  }
}

export async function executeQuery(query: string, params?: any) {
  try {
    const statement = global.DB.prepare(query);
    
    if (params) {
      // Bind parameters if provided
      Object.entries(params).forEach(([key, value]) => {
        statement.bind(key, value);
      });
    }
    
    return await statement.all();
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête:", error);
    throw error;
  }
}

export async function executeRun(query: string, params?: any) {
  try {
    const statement = global.DB.prepare(query);
    
    if (params) {
      // Bind parameters if provided
      Object.entries(params).forEach(([key, value]) => {
        statement.bind(key, value);
      });
    }
    
    return await statement.run();
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête:", error);
    throw error;
  }
}

// Fonctions utilitaires pour les opérations courantes

// Utilisateurs
export async function getUserById(id: number) {
  return (await executeQuery('SELECT * FROM users WHERE id = ?', [id])).results[0];
}

export async function getUserByEmail(email: string) {
  return (await executeQuery('SELECT * FROM users WHERE email = ?', [email])).results[0];
}

export async function getUserByUsername(username: string) {
  return (await executeQuery('SELECT * FROM users WHERE username = ?', [username])).results[0];
}

export async function createUser(username: string, email: string, passwordHash: string) {
  return await executeRun(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, passwordHash]
  );
}

// Tables de poker
export async function getPokerTables() {
  return (await executeQuery('SELECT * FROM poker_tables')).results;
}

export async function getPokerTableById(id: number) {
  return (await executeQuery('SELECT * FROM poker_tables WHERE id = ?', [id])).results[0];
}

export async function createPokerTable(name: string, maxPlayers: number, smallBlind: number, bigBlind: number, minBuyIn: number, maxBuyIn: number, isPrivate: boolean, password?: string) {
  return await executeRun(
    'INSERT INTO poker_tables (name, max_players, small_blind, big_blind, min_buy_in, max_buy_in, is_private, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, maxPlayers, smallBlind, bigBlind, minBuyIn, maxBuyIn, isPrivate, password]
  );
}

// Jeux
export async function getActiveGameByTableId(tableId: number) {
  return (await executeQuery(
    'SELECT * FROM games WHERE table_id = ? AND status = "active"',
    [tableId]
  )).results[0];
}

export async function createGame(tableId: number) {
  return await executeRun(
    'INSERT INTO games (table_id) VALUES (?)',
    [tableId]
  );
}

// Joueurs dans un jeu
export async function getGamePlayers(gameId: number) {
  return (await executeQuery(
    'SELECT gp.*, u.username, u.avatar_url FROM game_players gp JOIN users u ON gp.user_id = u.id WHERE gp.game_id = ?',
    [gameId]
  )).results;
}

export async function addPlayerToGame(gameId: number, userId: number, seatPosition: number, chipsAmount: number) {
  return await executeRun(
    'INSERT INTO game_players (game_id, user_id, seat_position, chips_amount) VALUES (?, ?, ?, ?)',
    [gameId, userId, seatPosition, chipsAmount]
  );
}

// Mains de poker
export async function getCurrentHand(gameId: number) {
  return (await executeQuery(
    'SELECT * FROM hands WHERE game_id = ? AND status != "completed" ORDER BY id DESC LIMIT 1',
    [gameId]
  )).results[0];
}

export async function createHand(gameId: number) {
  return await executeRun(
    'INSERT INTO hands (game_id) VALUES (?)',
    [gameId]
  );
}

// Transactions
export async function createTransaction(userId: number, amount: number, transactionType: string, referenceId?: number) {
  return await executeRun(
    'INSERT INTO transactions (user_id, amount, transaction_type, reference_id) VALUES (?, ?, ?, ?)',
    [userId, amount, transactionType, referenceId]
  );
}

// Mise à jour des jetons d'un utilisateur
export async function updateUserChips(userId: number, amount: number) {
  return await executeRun(
    'UPDATE users SET chips = chips + ? WHERE id = ?',
    [amount, userId]
  );
}
