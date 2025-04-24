import ipdstepModel from '../models/opdstepModel.js';
import { notifyClients } from '../services/socket.js';

//Fetch IPD Step data
export const getIPDStep = async (req, res) => {
    try {
        const data = await ipdstepModel.findOne();
        if (!data) {
            return res.status(404).json({ message: 'No IPD step data found' });
        }
        res.status(200).json(data);
    } catch(error){
        res.status(500).json({ message: 'Error fetching IPD step data', error });
    }
};

//Create IPD Step data
export const createIPDStep = async (req, res) => {
    try {
        const newData = new ipdstepModel({
            heading: req.body.heading || 'OPD Prescription Digitization: How GudMed Works',
            description: req.body.description || "GudMed's GudMed’s OPD prescription digitization process ...",steps: req.body.steps || [],
        });
        await newData.save();
        notifyClients('ipd_step', 'create', newData);
        res.status(201).json(newData);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating IPD step data', error });
    }
};

//Update IPD Step data

export const updateIPDStep = async( req, res) => {
    try {
        const data = await ipdstepModel.findOne();
        if (!data) {
            return createIPDStep(req, res);
        }
        Object.assign(data, req.body);
        await data.save();
        notifyClients('ipd_step', 'update', data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error updating IPD step data', error });
    }
};

//Delete IPD Step data (entire document)
export const deleteIPDStep = async (req, res) => {
    try {
        const data = await ipdstepModel.findOneAndDelete();
        if(!data) {
            return res.status(404).json({ message: 'No IPD step data found to delete' })
        } 
        notifyClients('ipd_step', 'delete', data._id);
        res.status(200).json({ message: 'IPD step data deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting IPD step data', error });
    }
};