// src/lib/auth.ts
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createUser, getUserByEmail, getUserByUsername } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'poker-app-secret-key';
const SALT_ROUNDS = 10;

export interface UserData {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  chips: number;
  is_admin: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export async function registerUser(username: string, email: string, password: string): Promise<{ success: boolean; message: string; userId?: number }> {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
      return { success: false, message: 'Cet email est déjà utilisé' };
    }

    const existingUserByUsername = await getUserByUsername(username);
    if (existingUserByUsername) {
      return { success: false, message: 'Ce nom d\'utilisateur est déjà pris' };
    }

    // Hasher le mot de passe
    const passwordHash = await hashPassword(password);

    // Créer l'utilisateur
    const result = await createUser(username, email, passwordHash);
    
    return { 
      success: true, 
      message: 'Inscription réussie', 
      userId: result.meta?.last_row_id as number 
    };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return { success: false, message: 'Une erreur est survenue lors de l\'inscription' };
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; message: string; token?: string; user?: UserData }> {
  try {
    // Récupérer l'utilisateur
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    // Vérifier le mot de passe
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    // Créer un token JWT
    const userData: UserData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url,
      chips: user.chips,
      is_admin: user.is_admin
    };

    const token = sign(userData, JWT_SECRET, { expiresIn: '7d' });

    return { 
      success: true, 
      message: 'Connexion réussie', 
      token,
      user: userData
    };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return { success: false, message: 'Une erreur est survenue lors de la connexion' };
  }
}

export function setAuthCookie(token: string): void {
  cookies().set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  });
}

export function removeAuthCookie(): void {
  cookies().delete('auth_token');
}

export function getAuthToken(): string | undefined {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  return token;
}

export function getCurrentUser(): UserData | null {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const user = verify(token, JWT_SECRET) as UserData;
    return user;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

export function requireAuth(redirectTo: string = '/auth/login'): UserData | null {
  const user = getCurrentUser();
  if (!user) {
    // Redirection côté client
    return null;
  }
  return user;
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.is_admin || false;
}
