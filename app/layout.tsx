import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Promptory — Tested AI Prompts & Workflow Hub',
  description: 'Discover curated, tested system prompts and automation recipes for real-world tasks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#080B10] text-zinc-100 min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Promptory. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
