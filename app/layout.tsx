import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Promptory | Curated Battle-Tested AI System Prompts',
  description: 'Discover tested, high-converting system prompts for ChatGPT, Claude, Gemini, and DeepSeek.',
  metadataBase: new URL('https://www.promptory.xyz'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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
