import { Team } from '../models/teamModel.js';
import { notifyClients } from '../services/socket.js';

// Get Team Data
export const getTeam = async (req, res) => {
    try {
        const team = await Team.find();
        if (!team || team.length === 0) {
            return res.status(404).json({ success: false, message: 'Team data not found' });
        }
        res.status(200).json({ success: true, data: team });
    } catch (error) {
        console.error('Error fetching Team data:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create Team Data
export const createTeam = async (req, res) => {
    try {
        const { heading, description, team, cards, advisoryboard } = req.body;

        const newTeam = new Team({ heading, description, team, cards, advisoryboard });
        const savedTeam = await newTeam.save();

        notifyClients?.('teamUpdated', savedTeam);
        res.status(201).json({ success: true, data: savedTeam });
    } catch (error) {
        console.error('Error creating Team data:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update Team Data
export const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, description, team, cards, advisoryboard } = req.body;

        const updatedTeam = await Team.findByIdAndUpdate(
            id,
            { heading, description, team, cards, advisoryboard },
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(404).json({ success: false, message: 'Team data not found' });
        }

        notifyClients?.('teamUpdated', updatedTeam);
        res.status(200).json({ success: true, data: updatedTeam });
    } catch (error) {
        console.error('Error updating Team data:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete Team Data
export const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTeam = await Team.findByIdAndDelete(id);
        if (!deletedTeam) {
            return res.status(404).json({ success: false, message: 'Team data not found' });
        }

        notifyClients?.('teamUpdated', deletedTeam);
        res.status(200).json({ success: true, message: 'Team data deleted successfully' });
    } catch (error) {
        console.error('Error deleting Team data:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

