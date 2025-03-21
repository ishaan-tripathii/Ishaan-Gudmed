import React, { useState, useEffect, useCallback } from 'react';
import useContentSocket from '../hooks/useContentSocket';
import pagesService from '../services/api/pagesService';
import DashboardLayout from '../components/common/Layout/DashboardLayout';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const WhyGudMedisUniquePage = () => {
  const [uniquePoints, setUniquePoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });

  const fetchUniquePoints = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await pagesService.getUniquePoints();
      setUniquePoints(data);
    } catch (err) {
      toast.error('Failed to fetch unique points');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Socket connection for real-time updates
  useContentSocket('uniquePoints', useCallback((data) => {
    if (data.points) {
      setUniquePoints(data.points);
    } else {
      fetchUniquePoints();
    }
  }, [fetchUniquePoints]));

  useEffect(() => {
    fetchUniquePoints();
  }, [fetchUniquePoints]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (selectedPoint) {
        await pagesService.updateUniquePoint(selectedPoint._id, formData);
        toast.success('Point updated successfully');
      } else {
        await pagesService.createUniquePoint(formData);
        toast.success('Point created successfully');
      }
      setIsModalOpen(false);
      setSelectedPoint(null);
      setFormData({ title: '', description: '', icon: '' });
      await fetchUniquePoints();
    } catch (err) {
      toast.error(selectedPoint ? 'Failed to update point' : 'Failed to create point');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this point?')) {
      try {
        setIsLoading(true);
        await pagesService.deleteUniquePoint(id);
        toast.success('Point deleted successfully');
        await fetchUniquePoints();
      } catch (err) {
        toast.error('Failed to delete point');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (point) => {
    setSelectedPoint(point);
    setFormData({
      title: point.title,
      description: point.description,
      icon: point.icon,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: 'Icon',
      accessor: 'icon',
      cell: (row) => <div className="text-2xl">{row.icon}</div>,
    },
    {
      header: 'Title',
      accessor: 'title',
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (row) => (
        <div className="max-w-md truncate">
          {row.description}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="icon"
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="icon"
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Why GudMed is Unique</h1>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedPoint(null);
              setFormData({ title: '', description: '', icon: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Add New Point
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table
            columns={columns}
            data={uniquePoints}
            isLoading={isLoading}
            className="w-full"
          />
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPoint(null);
            setFormData({ title: '', description: '', icon: '' });
          }}
          title={selectedPoint ? 'Edit Point' : 'Add New Point'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter emoji or icon"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPoint(null);
                  setFormData({ title: '', description: '', icon: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isLoading}
              >
                {selectedPoint ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default WhyGudMedisUniquePage;