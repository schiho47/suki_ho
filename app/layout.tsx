import '../styles/globals.scss';
import type { Metadata } from 'next';
import Script from 'next/script';

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
      <body>
        <Script
          src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
          strategy='afterInteractive'
        />
        {children}
      </body>
    </html>
  );
}

