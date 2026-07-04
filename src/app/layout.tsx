import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  Inter,
  Space_Grotesk,
  Noto_Sans_JP,
  IBM_Plex_Mono,
} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Agent Run Viewer — AI Observability Demo',
  description:
    'Visualize AI agent execution logs: steps, tool calls, success, and failure.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${notoSansJP.variable} ${ibmPlexMono.variable} min-h-screen font-body text-brand-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
