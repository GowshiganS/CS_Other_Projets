// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, confirmPassword } = await request.json();

    // Validation de base
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      );
    }

    // Validation du format d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe (au moins 8 caractères)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Inscription de l'utilisateur
    const result = await registerUser(username, email, password);

    if (result.success) {
      return NextResponse.json(
        { success: true, message: 'Inscription réussie' },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}
