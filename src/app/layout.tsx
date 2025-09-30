import Layout from '@/components/Layout';
import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Hajira',
  description: 'Redefining work, one step at a time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
        <Toaster position="bottom-center" reverseOrder={false} />
      </body>
    </html>
  );
}
