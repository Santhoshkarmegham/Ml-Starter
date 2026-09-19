import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Learnflow — Your Machine Learning Path',
  description: 'Learn machine learning step by step with concise lessons, practical exercises, and progress tracking.',
  metadataBase: new URL('https://learnflow-ml-path.skarmegham.chatgpt.site'),
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
