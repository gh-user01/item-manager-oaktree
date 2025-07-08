'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Item, apiService } from '../lib/api';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await apiService.getItems();
      setItems(fetchedItems);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (deletedId: number) => {
    setItems(items.filter(item => item.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <h2 className="text-lg font-medium text-red-900 mb-2">Error loading items</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button onClick={loadItems} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">All Items ({items.length})</h1>
        <Link href="/create-item" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded transition-colors">
          Add New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <h2 className="text-xl font-medium text-gray-900 mb-4">No items yet</h2>
          <p className="mb-8 leading-relaxed">Get started by creating your first item. You can add a name, description, and price.</p>
          <Link href="/create-item" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded transition-colors">
            Create Your First Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}
    </>
  );
}
