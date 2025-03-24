// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { loginUser, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation de base
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Connexion de l'utilisateur
    const result = await loginUser(email, password);

    if (result.success && result.token) {
      // Définir le cookie d'authentification
      setAuthCookie(result.token);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Connexion réussie',
          user: result.user
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
}
