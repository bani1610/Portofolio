import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { ThemeScript } from '@/components/shared/theme-script';
import './globals.css';

// Self-hosted by next/font: no request to a third-party domain, which
// the Best Practices target depends on (DESIGN.md §3.1).
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sholahuddin Robbani · Web Developer',
  description:
    'Portfolio Sholahuddin Robbani, Web Developer yang berfokus pada pengembangan aplikasi web.',
};

export const viewport: Viewport = {
  // Matches --background of the dark theme; ThemeScript rewrites it when
  // the visitor has chosen light (DESIGN.md §10).
  themeColor: 'oklch(0.145 0.006 285)',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      // The theme class is set by ThemeScript before hydration, so the
      // server markup intentionally differs from the client.
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
