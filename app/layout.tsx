import type { Metadata } from 'next';
import './globals.css';
import './alignment.css';
import './fluid-theme.css';

export const metadata: Metadata = {
  title: 'Learnflow — Your Machine Learning Path',
  description: 'Learn machine learning step by step with concise lessons, practical exercises, and progress tracking.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Learnflow — Your Machine Learning Path',
    description: 'Machine learning, step by step. Learn with concise lessons, practical exercises, and saved progress.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Learnflow — Machine learning, step by step.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learnflow — Your Machine Learning Path',
    description: 'Machine learning, step by step. Learn with concise lessons, practical exercises, and saved progress.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
