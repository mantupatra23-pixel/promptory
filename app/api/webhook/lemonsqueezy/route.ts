import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

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
    const userEmail = customData?.user_email || payload.data?.attributes?.user_email;

    if (!userEmail) {
      return NextResponse.json({ message: 'No user email found, ignoring' }, { status: 200 });
    }

    // Handle Active Subscription / One-time Purchase
    if (
      eventName === 'subscription_created' ||
      eventName === 'subscription_updated' ||
      eventName === 'order_created'
    ) {
      const status = payload.data?.attributes?.status || 'active';
      const isSubActive = status === 'active' || status === 'paid';

      const { error } = await supabase
        .from('subscriptions')
        .upsert(
          {
            user_email: userEmail.toLowerCase().trim(),
            status: isSubActive ? 'active' : status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_email' }
        );

      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true, user: userEmail, status: 'active' }, { status: 200 });
    }

    // Handle Cancellation / Expiration
    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('user_email', userEmail.toLowerCase().trim());

      return NextResponse.json({ success: true, message: 'Subscription cancelled' }, { status: 200 });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
