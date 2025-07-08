'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Item, apiService, UpdateItemData, CreateItemData } from '../../../../lib/api';
import ItemForm from '../../../../components/ItemForm';
import { useAuth } from '../../../../contexts/AuthContext';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ItemDetail({ params }: PageProps) {
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      if (resolvedParams.id) {
        loadItem(Number(resolvedParams.id));
      }
    };
    loadData();
  }, [params]);

  const loadItem = async (itemId: number) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItem = await apiService.getItem(itemId);
      setItem(fetchedItem);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: UpdateItemData) => {
    if (!item) return;

    setIsUpdating(true);
    try {
      const updatedItem = await apiService.updateItem(item.id, data);
      setItem(updatedItem);
      setEditing(false);
    } catch (error) {
      throw error; // Let the form handle the error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFormSubmit = async (data: CreateItemData) => {
    // Convert CreateItemData to UpdateItemData for the update operation
    await handleUpdate(data);
  };

  const handleDelete = async () => {
    if (!item) return;

    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiService.deleteItem(item.id);
      router.push('/');
    } catch (error) {
      alert('Failed to delete item: ' + (error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
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
      <>
        <div className="mb-8">
          <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
            ← Back to Items
          </Link>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h2 className="text-lg font-medium text-red-900 mb-2">Error loading item</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button onClick={async () => {
            const resolvedParams = await params;
            if (resolvedParams.id) {
              loadItem(Number(resolvedParams.id));
            }
          }} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
            Try Again
          </button>
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <div className="mb-8">
          <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
            ← Back to Items
          </Link>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h2 className="text-lg font-medium text-red-900 mb-2">Item not found</h2>
          <p className="text-red-700">The item you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
          ← Back to Items
        </Link>
      </div>

      {editing ? (
        <>
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-8">Edit Item</h1>
          <ItemForm
            initialData={item}
            onSubmit={handleFormSubmit}
            submitLabel="Update Item"
            isLoading={isUpdating}
          />
          <div className="text-center mt-4">
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">{item.name}</h1>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Description</h3>
            <p className="text-gray-900 leading-relaxed">
              {item.description || 'No description provided'}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Price</h3>
            <div className="text-3xl font-semibold text-green-600">
              ${item.price.toFixed(2)}
            </div>
          </div>

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-700 text-sm">
                Sign in to edit or delete this item.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleEditClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition-colors"
              title={!isAuthenticated ? 'Sign in to edit items' : ''}
            >
              Edit Item
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded transition-colors"
              title={!isAuthenticated ? 'Sign in to delete items' : ''}
            >
              {isDeleting ? 'Deleting...' : 'Delete Item'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
