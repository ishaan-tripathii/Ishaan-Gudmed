import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates';
import WhyGudMedForm from './WhyGudMedForm';

const WhyGudMedManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const { data: whyGudMedItems, loading, emitEvent, refetch } = useRealtimeUpdates('whyGudMed');

  const handleCreate = async (formData) => {
    try {
      const response = await fetch('/api/why-gudmed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create item');

      const newItem = await response.json();
      emitEvent('create', newItem);
      toast.success('Item created successfully');
      setIsFormOpen(false);
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create item');
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const response = await fetch(`/api/why-gudmed/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update item');

      const updatedItem = await response.json();
      emitEvent('update', updatedItem);
      toast.success('Item updated successfully');
      setIsFormOpen(false);
      setItemToEdit(null);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/why-gudmed/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      emitEvent('delete', id);
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Why GudMed Is Unique</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {whyGudMedItems.map((item) => (
          <div key={item._id} className="border rounded-lg p-4 shadow">
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setItemToEdit(item);
                  setIsFormOpen(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <WhyGudMedForm
          item={itemToEdit}
          onSubmit={itemToEdit ? handleUpdate : handleCreate}
          onClose={() => {
            setIsFormOpen(false);
            setItemToEdit(null);
          }}
        />
      )}
    </div>
  );
};

export default WhyGudMedManager;