import type { Metadata } from 'next';
import { Sidebar, Header } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'ETHANI - Food Price Stabilization',
  description: 'Rule-based, transparent food price stabilization system',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100">
        <Sidebar />
        <Header />
        
        {/* Main content area */}
        <main className="lg:ml-64 lg:pt-16 pt-16 lg:pt-0 pb-8">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
