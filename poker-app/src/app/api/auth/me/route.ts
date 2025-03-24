// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserById } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'utilisateur actuel à partir du token JWT
    const user = getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }
    
    // Récupérer les informations à jour de l'utilisateur depuis la base de données
    const userData = await getUserById(user.id);
    
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Ne pas renvoyer le mot de passe hashé
    const { password_hash, ...userWithoutPassword } = userData;
    
    return NextResponse.json(
      { 
        success: true, 
        user: userWithoutPassword
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue lors de la récupération du profil' },
      { status: 500 }
    );
  }
}
