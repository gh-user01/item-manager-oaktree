import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
