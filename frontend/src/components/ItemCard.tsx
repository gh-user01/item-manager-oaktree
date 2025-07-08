import Link from 'next/link';
import { useState } from 'react';
import { Item, apiService } from '../lib/api';

interface ItemCardProps {
  item: Item;
  onDelete: (id: number) => void;
}

export default function ItemCard({ item, onDelete }: ItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsDeleting(true);
      try {
        await apiService.deleteItem(item.id);
        onDelete(item.id);
      } catch (error) {
        alert('Failed to delete item: ' + (error as Error).message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{item.description || 'No description available'}</p>
      <div className="text-xl font-semibold text-green-600 mb-4">${item.price.toFixed(2)}</div>
      
      <div className="flex gap-2 flex-wrap">
        <Link href={`/item/${item.id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm rounded transition-colors">
          View Details
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-3 py-1.5 text-sm rounded transition-colors"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
