import type {Metadata} from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Medyrax - Your Digital Clinician',
  description: 'Upload your prescription. Understand it instantly.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-body bg-surface text-on-surface antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
