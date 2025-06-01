import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireAuth(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      throw new Error('Unauthorized');
    }
    
    return session.user;
  } catch (error) {
    throw new Error('Authentication required');
  }
}

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function isAuthenticated() {
  try {
    const session = await getServerSession(authOptions);
    return !!session?.user;
  } catch (error) {
    return false;
  }
} 