import ImageComparison from "../models/imageComparisonModel.js";
import { notifyClients } from "../services/socket.js";

export const getImageComparison = async (req, res) => {
  try {
    const data = await ImageComparison.findOne();
    if (!data) {
      const newData = new ImageComparison({
        heading: "Sample Prescription",
        description: "Move the slider left and right to see the magic!",
        sections: [
          {
            title: "In English",
            beforeImage: "http://localhost:5000/images/compare-image.png",
            afterImage: "http://localhost:5000/images/compare-image-english.png",
          },
          {
            title: "हिन्दी में",
            beforeImage: "http://localhost:5000/images/compare-image.png",
            afterImage: "http://localhost:5000/images/compare-image-hindi.png",
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
    if (!data) {
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
};