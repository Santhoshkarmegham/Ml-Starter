import type { Metadata } from 'next';
import './globals.css';
import './alignment.css';
import './fluid-theme.css';

function getMetadataBase() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) return new URL('http://localhost:3000');

  try {
    return new URL(configuredUrl.startsWith('http') ? configuredUrl : `https://${configuredUrl}`);
  } catch {
    return new URL('http://localhost:3000');
  }
}

export const metadata: Metadata = {
  title: 'Learnflow — Your Machine Learning Path',
  description: 'Learn machine learning step by step with concise lessons, practical exercises, and progress tracking.',
  metadataBase: getMetadataBase(),
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
