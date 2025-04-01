import WhyGudMed from '../models/WhyGudMedModel.js';
import { notifyClients } from '../services/socket.js';

// Get all WhyGudMed items
export const getWhyGudMedItems = async (req, res) => {
    try {
        const items = await WhyGudMed.find();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching WhyGudMed items:', error);
        res.status(500).json({ message: 'Failed to fetch items', error: error.message });
    }
};

// Create a new WhyGudMed item
export const createWhyGudMedItem = async (req, res) => {
    try {
        const newItem = new WhyGudMed(req.body);
        const savedItem = await newItem.save();

        // Emit socket event for real-time update
        notifyClients('whyGudMed', 'create', savedItem);

        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error creating WhyGudMed item:', error);
        res.status(500).json({ message: 'Failed to create item', error: error.message });
    }
};

// Update a WhyGudMed item
export const updateWhyGudMedItem = async (req, res) => {
    try {
        const updatedItem = await WhyGudMed.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Emit socket event for real-time update
        notifyClients('whyGudMed', 'update', updatedItem);

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating WhyGudMed item:', error);
        res.status(500).json({ message: 'Failed to update item', error: error.message });
    }
};

// Delete a WhyGudMed item
export const deleteWhyGudMedItem = async (req, res) => {
    try {
        const deletedItem = await WhyGudMed.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Emit socket event for real-time update
        notifyClients('whyGudMed', 'delete', req.params.id);

        res.status(200).json({ message: 'Item deleted successfully', id: req.params.id });
    } catch (error) {
        console.error('Error deleting WhyGudMed item:', error);
        res.status(500).json({ message: 'Failed to delete item', error: error.message });
    }
}; 