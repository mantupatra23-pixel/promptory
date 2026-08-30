import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.promptory.xyz'),
  title: {
    default: 'Promptory — The Open AI System Prompt Directory & Workflows',
    template: '%s | Promptory',
  },
  description:
    'Promptory is the open curated library of 280+ battle-tested AI system prompts and chained workflows for ChatGPT, Claude 3.5, Gemini Pro, and DeepSeek-R1.',
  keywords: [
    'Promptory',
    'AI System Prompts',
    'Prompt Library',
    'ChatGPT Prompts',
    'Claude Prompts',
    'Gemini Prompts',
    'DeepSeek Prompts',
    'AI Workflows',
    'Prompt Engineering',
  ],
  authors: [{ name: 'Promptory Team', url: 'https://www.promptory.xyz' }],
  creator: 'Promptory',
  publisher: 'Promptory',
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
    description: 'Discover 280+ battle-tested system prompts and chained workflows.',
    url: 'https://www.promptory.xyz',
    siteName: 'Promptory',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.promptory.xyz/api/og?title=Promptory+AI+Directory&model=All+Models&role=Engineers',
        width: 1200,
        height: 630,
        alt: 'Promptory AI Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promptory — The Open AI System Prompt Directory & Workflows',
    description: 'Discover 280+ battle-tested system prompts and chained workflows.',
    images: ['https://www.promptory.xyz/api/og?title=Promptory+AI+Directory&model=All+Models&role=Engineers'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
    sameAs: [
      'https://github.com/mantupatra23-pixel/promptory',
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

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandOrganizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSearchSchema) }}
        />
      </head>
      <body className="bg-[#0D1117] text-[#E6EDF3] min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
        {/* Google Analytics 4 Tag Injection */}
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
