// app/api/debug-env/route.ts
// TEMPORARY - Remove this file after debugging
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    adminEmailValue: process.env.ADMIN_EMAIL || 'NOT SET',
    // Don't expose actual password in production
    passwordLength: process.env.ADMIN_PASSWORD?.length || 0,
  });
}