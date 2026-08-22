import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Promptory | Curated Battle-Tested AI System Prompts',
  description: 'Discover tested, high-converting system prompts and chained workflows for ChatGPT, Claude, Gemini, and DeepSeek.',
  metadataBase: new URL('https://www.promptory.xyz'),
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Promptory | Curated Battle-Tested AI System Prompts',
    description: 'Discover tested, high-converting system prompts and chained workflows.',
    url: 'https://www.promptory.xyz',
    siteName: 'Promptory',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Promptory Logo',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="bg-[#0D1117] text-[#E6EDF3] min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
