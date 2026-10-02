import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const envCheck = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    lemonSqueezySecret: !!process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    nodeEnv: process.env.NODE_ENV,
  };

  // Live Database Ping Test
  let dbStatus = 'disconnected';
  let promptCount = 0;

  try {
    const { count, error } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      dbStatus = 'connected';
      promptCount = count || 0;
    } else {
      dbStatus = `error: ${error.message}`;
    }
  } catch (err: any) {
    dbStatus = `failed: ${err.message}`;
  }

  const allHealthy = envCheck.supabaseUrl && envCheck.supabaseAnonKey && dbStatus === 'connected';

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        totalPrompts: promptCount,
      },
      environment: envCheck,
    },
    { status: allHealthy ? 200 : 500 }
  );
}
