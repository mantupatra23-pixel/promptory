import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || process.env.NEXT_PUBLIC_GA_ID || 'GTM-NS5C5KZG';

export const viewport: Viewport = {
  themeColor: '#0D1117',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.promptory.xyz'),
  title: {
    default: 'Promptory — The Open AI System Prompt Directory & Workflows',
    template: '%s | Promptory',
  },
  description:
    'Promptory is the open curated library of 280+ battle-tested AI system prompts and chained workflows for ChatGPT, Claude 3.5, Gemini Pro, and DeepSeek-R1. Test, customize, and deploy production-ready prompts.',
  applicationName: 'Promptory',
  keywords: [
    'Promptory',
    'AI System Prompts',
    'Prompt Library',
    'ChatGPT Prompts',
    'Claude Sonnet Prompts',
    'DeepSeek R1 Prompts',
    'Gemini Pro Prompts',
    'AI Workflows',
    'Prompt Engineering',
    'Production AI Prompts',
    'Developer Prompts',
    'Deterministic AI Prompts',
  ],
  authors: [{ name: 'Promptory Core Team', url: 'https://www.promptory.xyz' }],
  creator: 'Promptory',
  publisher: 'Promptory',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.promptory.xyz',
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Promptory — The Open AI System Prompt Directory & Workflows',
    description:
      'Explore 280+ audited, deterministic AI system prompts and multi-step workflows. Built for developers, marketers, and technical founders.',
    url: 'https://www.promptory.xyz',
    siteName: 'Promptory',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.promptory.xyz/api/og?title=Promptory+AI+Directory&model=All+Models&role=Engineers&score=99',
        width: 1200,
        height: 630,
        alt: 'Promptory — Open AI System Prompt Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promptory — The Open AI System Prompt Directory & Workflows',
    description:
      'Curated repository of 280+ audited AI system prompts for ChatGPT, Claude, DeepSeek, and Gemini.',
    images: ['https://www.promptory.xyz/api/og?title=Promptory+AI+Directory&model=All+Models&role=Engineers&score=99'],
    creator: '@promptory',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brandOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Promptory',
    url: 'https://www.promptory.xyz',
    logo: 'https://www.promptory.xyz/logo.png',
    description: 'The open curated directory of battle-tested AI system prompts and chained execution workflows.',
    sameAs: [
      'https://github.com/mantupatra23-pixel/promptory',
      'https://github.com/mantupatra23-pixel/awesome-ai-system-prompts',
    ],
  };

  const webSiteSearchSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Promptory',
    url: 'https://www.promptory.xyz',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.promptory.xyz/directory?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Promptory AI Platform',
    url: 'https://www.promptory.xyz',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Google Tag Manager Container Script */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />

        {/* DNS Preconnects for Fast Performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* Brand Favicon & Icons */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandOrganizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSearchSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
        />
      </head>

      <body className="bg-[#0D1117] text-[#E6EDF3] min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
