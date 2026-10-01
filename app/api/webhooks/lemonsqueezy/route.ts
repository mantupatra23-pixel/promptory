import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    // Verify Lemon Squeezy HMAC SHA256 Signature
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const subscriptionData = payload.data;

    if (!subscriptionData) {
      return NextResponse.json({ message: 'No payload data' }, { status: 200 });
    }

    const subId = subscriptionData.id?.toString();
    const attrs = subscriptionData.attributes;
    const customData = payload.meta?.custom_data || {};
    const userId = customData.user_id || null;

    if (eventName === 'subscription_created' || eventName === 'subscription_updated' || eventName === 'subscription_resumed') {
      await supabase.from('subscriptions').upsert({
        id: subId,
        user_id: userId,
        customer_id: attrs.customer_id?.toString(),
        status: attrs.status, // 'active', 'on_trial', 'past_due'
        variant_id: attrs.variant_id?.toString(),
        renews_at: attrs.renews_at,
        ends_at: attrs.ends_at,
        updated_at: new Date().toISOString(),
      });
    }

    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      await supabase.from('subscriptions').update({
        status: attrs.status || 'cancelled',
        ends_at: attrs.ends_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', subId);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
