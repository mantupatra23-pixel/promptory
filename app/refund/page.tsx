import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy - Promptory',
  description: 'Refund and cancellation policy for Promptory Pro subscriptions.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f4f4f5] px-6 py-20 flex justify-center">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <Link href="/" className="text-xs text-emerald-400 hover:underline">
            ← Back to Directory
          </Link>
          <h1 className="text-3xl font-bold mt-4 tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-sm text-zinc-400 mt-1">Last updated: October 2026</p>
        </div>

        <section className="space-y-4 text-zinc-300 leading-relaxed text-sm">
          <h2 className="text-lg font-semibold text-white">1. 7-Day Money-Back Guarantee</h2>
          <p>
            We stand behind the quality of Promptory workflows and blueprints. If you upgrade to Promptory Pro and find that the production prompts, execution schemas, or .cursorrules export do not meet your expectations, you are eligible for a <strong>full refund within 7 days</strong> of your initial purchase.
          </p>

          <h2 className="text-lg font-semibold text-white">2. How to Request a Refund</h2>
          <p>
            To initiate a refund, please send an email to <a href="mailto:pmantu808@gmail.com" className="text-emerald-400 underline">pmantu808@gmail.com</a> with the subject line <code>Refund Request - [Your Account Email]</code>. Please include your purchase receipt or Lemon Squeezy order number.
          </p>
          <p>
            Refund requests are reviewed and processed within <strong>24 to 48 business hours</strong>. Once approved, the funds will be reversed to your original payment method within 5–7 business days depending on your bank.
          </p>

          <h2 className="text-lg font-semibold text-white">3. Subscription Cancellation</h2>
          <p>
            You can cancel your recurring Pro subscription at any time directly through your customer portal or by reaching out to support. Upon cancellation, you will retain access to Pro features until the conclusion of your current billing period.
          </p>

          <h2 className="text-lg font-semibold text-white">4. Merchant of Record</h2>
          <p>
            Our order process is conducted by our online reseller & Merchant of Record, <strong>Lemon Squeezy</strong>. Lemon Squeezy handles all customer service inquiries and returns relating to payments.
          </p>
        </section>
      </div>
    </div>
  );
}
