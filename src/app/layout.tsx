import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: {
    default: 'StaysKenya - Find Airbnbs & Guest Rooms in Meru',
    template: '%s | StaysKenya',
  },
  description: 'Find Airbnbs & Guest Rooms in Meru. Starting with Meru, expanding across Kenya.',
  applicationName: 'StaysKenya',
  keywords: ['Meru', 'Kenya', 'Airbnb', 'Guest Rooms', 'Holiday Homes', 'Vacation Rentals', 'Accommodation', 'Travel', 'Booking'],
  authors: [{ name: 'StaysKenya', url: 'https://www.stayskenya.top' }],
  creator: 'StaysKenya',
  publisher: 'StaysKenya',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://www.stayskenya.top',
    title: 'StaysKenya - Find Airbnbs & Guest Rooms in Meru',
    description: 'Find Airbnbs & Guest Rooms in Meru. Starting with Meru, expanding across Kenya.',
    siteName: 'StaysKenya',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StaysKenya - Find Airbnbs & Guest Rooms in Meru',
    description: 'Find Airbnbs & Guest Rooms in Meru. Starting with Meru, expanding across Kenya.',
  },
  themeColor: '#ffffff',
  icons: {
    icon: '/favicon.ico',
  },
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <FirebaseClientProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
