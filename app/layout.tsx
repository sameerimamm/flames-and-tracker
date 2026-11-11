import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FLAMES Destiny Calculator — Predict Your Relationship',
  description: 'Calculate FLAMES (Friends, Love, Affection, Marriage, Enemies, Siblings) between two people with real-time visual letter cancellation and animated circular elimination.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
