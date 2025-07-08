import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-12 text-gray-600">
      <h2 className="text-xl font-medium text-gray-900 mb-4">Page Not Found</h2>
      <p className="mb-8 leading-relaxed">Could not find the requested page.</p>
      <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded transition-colors">
        Return Home
      </Link>
    </div>
  );
}
