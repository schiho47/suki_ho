import '../styles/globals.scss';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suki Ho',
  description: 'A Frontend Developer based in Taipei',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/images/logo_background.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}

