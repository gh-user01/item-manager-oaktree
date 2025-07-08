import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Item Manager',
  description: 'Manage your items with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-gray-900 bg-gray-50">
        <header className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">Item Manager</h1>
              <nav className="flex gap-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded transition-colors">
                  Home
                </Link>
                <Link href="/create-item" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded transition-colors">
                  Add Item
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="py-8 min-h-[calc(100vh-5rem)]">
          <div className="max-w-6xl mx-auto px-5">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
