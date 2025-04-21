import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure fresh response

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      service: 'colorcraft-api'
    },
    { status: 200 }
  );
} 