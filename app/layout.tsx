import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.promptory.xyz'),
  title: 'Promptory — Tested AI Prompts & Workflow Engine',
  description: 'Curated, tested system prompts and automation recipes for ChatGPT, Claude, Gemini, and DeepSeek.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0A0D12] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200 pb-16 sm:pb-0`}>
        <ToastProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </ToastProvider>
      </body>
    </html>
  );
}
