'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiService, CreateItemData } from '../../lib/api';
import ItemForm from '../../components/ItemForm';

export default function CreateItem() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: CreateItemData) => {
    setIsLoading(true);
    try {
      await apiService.createItem(data);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      throw error; // Let the form handle the error
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <h2 className="text-lg font-medium text-green-900 mb-2">Item created successfully!</h2>
        <p className="text-green-700">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
          ← Back to Items
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-center text-gray-900 mb-8">Create New Item</h1>

      <ItemForm
        onSubmit={handleSubmit}
        submitLabel="Create Item"
        isLoading={isLoading}
      />
    </>
  );
}
