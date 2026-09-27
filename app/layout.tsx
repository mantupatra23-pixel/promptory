import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.promptory.xyz'),
  title: {
    default: 'Promptory — Curated AI Prompts & Workflow Templates',
    template: '%s | Promptory',
  },
  description:
    'Curated AI prompts and workflow templates built for engineers, marketers, founders and operators across Claude 3.5, DeepSeek-R1, and ChatGPT.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

const centralizedEntityGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.promptory.xyz/#organization',
      name: 'Promptory',
      url: 'https://www.promptory.xyz/',
      logo: 'https://www.promptory.xyz/logo.png',
      sameAs: [
        'https://www.producthunt.com/products/promptory',
        'https://github.com/topics/promptory',
        'https://alternativeto.net/software/promptory/'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.promptory.xyz/#website',
      url: 'https://www.promptory.xyz/',
      name: 'Promptory',
      publisher: { '@id': 'https://www.promptory.xyz/#organization' }
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://www.promptory.xyz/#webapp',
      name: 'Promptory',
      url: 'https://www.promptory.xyz/',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      browserRequirements: 'HTML5 compatible browser',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '184'
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(centralizedEntityGraph) }}
        />
      </head>
      <body className="min-h-screen bg-[#0D1117] text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
