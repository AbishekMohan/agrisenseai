import type {Metadata} from 'next';
import './globals.css';
import {Navigation} from '@/components/Navigation';
import {Header} from '@/components/Header';
import {Toaster} from '@/components/ui/toaster';
import {SensorProvider} from '@/context/SensorContext';
import {ThemeProvider} from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'AgriSense AI',
  description: 'Precision agricultural technology for small farmers in India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23386641'/%3E%3Cpath d='M46 18C32 20 23 30 20 42c8-4 14-10 18-18-3 10-9 18-18 24' stroke='%23F8F5E6' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground pb-20" suppressHydrationWarning>
        <ThemeProvider>
          <SensorProvider>
            <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-background relative flex flex-col border-x border-border/40">
              <Header />
              <main className="flex-1 px-4 py-4 space-y-6 overflow-x-hidden">
                {children}
              </main>
              <Navigation />
            </div>
            <Toaster />
          </SensorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
