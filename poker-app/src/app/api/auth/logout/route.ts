// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Supprimer le cookie d'authentification
    removeAuthCookie();
    
    return NextResponse.json(
      { success: true, message: 'Déconnexion réussie' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue lors de la déconnexion' },
      { status: 500 }
    );
  }
}
