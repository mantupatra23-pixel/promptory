export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Log custom user events (Copy, Launch, Simulate)
export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag && GA_TRACKING_ID) {
    (window as any).gtag('event', action, params);
  }
};
