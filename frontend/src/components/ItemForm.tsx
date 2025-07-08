import { useState, FormEvent } from 'react';
import { CreateItemData } from '../lib/api';

interface ItemFormProps {
  initialData?: Partial<CreateItemData>;
  onSubmit: (data: CreateItemData) => Promise<void>;
  submitLabel: string;
  isLoading?: boolean;
}

export default function ItemForm({ 
  initialData = {}, 
  onSubmit, 
  submitLabel, 
  isLoading = false 
}: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price?.toString() || '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('Name is required');
    }

    if (!formData.price) {
      newErrors.push('Price is required');
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.push('Price must be a positive number');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      setErrors([(error as Error).message]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8 max-w-lg mx-auto">
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <ul className="list-disc list-inside text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="name" className="block mb-2 font-medium text-gray-900">
          Name *
        </label>
        <input
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-colors disabled:opacity-60"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isLoading}
          placeholder="Enter item name"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block mb-2 font-medium text-gray-900">
          Description
        </label>
        <textarea
          id="description"
          className="w-full px-3 py-2 border border-gray-300 rounded resize-y min-h-20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-colors disabled:opacity-60"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isLoading}
          placeholder="Enter item description"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="price" className="block mb-2 font-medium text-gray-900">
          Price *
        </label>
        <input
          type="number"
          id="price"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-colors disabled:opacity-60"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          disabled={isLoading}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-3 rounded transition-colors"
      >
        {isLoading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
