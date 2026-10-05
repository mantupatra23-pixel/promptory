export const DEFAULT_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_CHECKOUT_URL ||
  'https://promptory-ai.lemonsqueezy.com/checkout/buy/750e2a22-3cc6-45fe-9b40-b4549cd38f8c';

export function getCheckoutUrl(email?: string | null, name?: string | null): string {
  const base = DEFAULT_CHECKOUT_URL;
  const url = new URL(base);

  if (email && email.trim()) {
    url.searchParams.set('checkout[email]', email.trim());
  }
  if (name && name.trim()) {
    url.searchParams.set('checkout[name]', name.trim());
  }

  return url.toString();
}
