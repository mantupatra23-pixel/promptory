import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Webhook ke liye Admin client create karein (RLS bypass ke sath)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

    // Verify webhook signature if secret exists
    if (secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signatureBuffer = Buffer.from(signature, 'utf8');

      if (signatureBuffer.length !== digest.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data;
    
    // Extract user email from multiple possible locations
    const userEmail = 
      customData?.user_email || 
      payload.data?.attributes?.user_email || 
      payload.data?.attributes?.customer_email;

    if (!userEmail) {
      return NextResponse.json({ message: 'No user email found, acknowledged' }, { status: 200 });
    }

    const cleanEmail = userEmail.toLowerCase().trim();

    // Handle payment & subscription creation events
    const successEvents = [
      'subscription_created',
      'subscription_updated',
      'subscription_payment_success',
      'order_created',
    ];

    if (successEvents.includes(eventName)) {
      const attrStatus = payload.data?.attributes?.status || 'active';
      const isSubActive = attrStatus === 'active' || attrStatus === 'paid';

      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .upsert(
          {
            user_email: cleanEmail,
            status: isSubActive ? 'active' : attrStatus,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_email' }
        )
        .select();

      if (error) {
        console.error('Supabase update error:', error.message, error.details);
        return NextResponse.json({ 
          error: 'Database update failed', 
          details: error.message 
        }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        user: cleanEmail, 
        status: isSubActive ? 'active' : attrStatus,
        event: eventName 
      }, { status: 200 });
    }

    // Handle Cancellation / Expiration
    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('user_email', cleanEmail);

      return NextResponse.json({ success: true, message: 'Subscription cancelled' }, { status: 200 });
    }

    return NextResponse.json({ received: true, event: eventName });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
