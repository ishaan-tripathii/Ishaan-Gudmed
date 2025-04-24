import mongoose from "mongoose";
import { notifyClients } from "../services/socket.js";
import ImageComparison from "../models/imageComparisonModel.js";

export const getImageComparison = async (req, res) => {
    try {
        const data = await ImageComparison.findOne();
        if (!data) {
            const newData = new ImageComparison({
                heading: "Discharge Summary",
                description: "Move the slider left and right to see the magic!",
                sections: [
                    {
                        title: "Page1",
                        beforeImage: "http://localhost:3000/static/media/ipd%201%201-0%20(1).52e7528d24e0dc3f0c0c.jpg",
                        afterImage: "http://localhost:3000/static/media/HCG_ipd_724409.pdf%20(1).cfdb12a63da8e2c7567f.png",
                    },
                    {
                        title: "Page2",
                        beforeImage: "http://localhost:3000/static/media/ipd%201%201_page-0002.25d90e68c8fe464f2a09.jpg",
                        afterImage: "http://localhost:3000/static/media/HCG_ipd_724409.pdf.a7c6e2728b8c02056f57.png",
                    },
                ],
            });
            await newData.save();
            notifyClients("imageComparison", "created", newData);
            return res.status(200).json(newData);
        }
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching image comparison data:", error);
        res.status(500).json({ message: "Error fetching image comparison data", error: error.message });
    }
};

export const updateImageComparison = async (req, res) => {
    try {
         const data = await ImageComparison.findOne();
         if (!data){
            const newData = new ImageComparison(req.body);
            await newData.save();
            notifyClients("imageComparison", "created", newData);
            return res.status(201).json(newData);
         }
         Object.assign(data, req.body);
         await data.save();
         notifyClients("imageComparison", "updated", data);
         res.status(200).json(data);
    } catch (error) {
        console.error("Error updating image comparison data:", error);
        res.status(500).json({ message: "Error updating image comparison data", error: error.message });
    }
}