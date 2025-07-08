'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <h2 className="text-lg font-medium text-red-900 mb-2">Something went wrong!</h2>
      <p className="text-red-700 mb-4">{error.message}</p>
      <button onClick={reset} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
        Try again
      </button>
    </div>
  );
}
