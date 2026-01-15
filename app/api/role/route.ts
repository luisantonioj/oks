// app/api/role/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/queries/user';

/**
 * GET /api/role
 * Returns the current user's role and appropriate redirect path
 */
export async function GET() {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'Unauthorized', redirect: '/auth/login' },
        { status: 401 }
      );
    }

    // Return role and appropriate redirect path
    const redirectPaths = {
      admin: '/protected/admin/dashboard',
      office: '/protected/office/dashboard',
      stakeholder: '/protected/stakeholder/dashboard',
    };

    return NextResponse.json({
      role: profile.role,
      redirect: redirectPaths[profile.role],
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      },
    });
  } catch (error) {
    console.error('Role detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}