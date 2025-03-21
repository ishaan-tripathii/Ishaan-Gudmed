import WhyGudMedPage from "../models/WhyGudMedisUniqueModel.js";
import { notifyClients } from "../services/socket.js";

export const getWhyGudMedPages = async (req, res) => {
  try {
    const { id } = req.params;
    const pages = id ? await WhyGudMedPage.findById(id) : await WhyGudMedPage.find();

    console.log(`✅ GET operation performed. ID: ${id || 'ALL'}, Data:`, pages);

    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    console.error("❌ Error fetching Why GudMed Pages:", error);
    res.status(500).json({ success: false, message: "Error fetching Why GudMed Pages", error: error.message });
  }
};

export const createWhyGudMedPage = async (req, res) => {
  try {
    const newPage = await WhyGudMedPage.create(req.body);
    console.log(`✅ CREATE operation performed. Data:`, newPage);

    // Notify clients about the new page
    notifyClients("whyGudMedUpdated", newPage);

    res.status(201).json({
      success: true,
      message: "Why GudMed Page created successfully!",
      data: newPage,
    });
  } catch (error) {
    console.error("❌ Error creating Why GudMed Page:", error);
    res.status(500).json({
      success: false,
      message: "Error creating Why GudMed Page",
      error: error.message,
    });
  }
};

export const updateWhyGudMedPage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPage = await WhyGudMedPage.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPage) {
      console.warn(`⚠️ UPDATE operation failed. Why GudMed Page with ID ${id} not found.`);
      return res.status(404).json({ success: false, message: "Why GudMed Page not found" });
    }

    console.log(`✅ UPDATE operation performed. ID: ${id}, Data:`, updatedPage);

    // Notify clients about the update
    notifyClients("whyGudMedUpdated", updatedPage);

    res.status(200).json({
      success: true,
      message: "Why GudMed Page updated successfully!",
      data: updatedPage,
    });
  } catch (error) {
    console.error("❌ Error updating Why GudMed Page:", error);
    res.status(500).json({
      success: false,
      message: "Error updating Why GudMed Page",
      error: error.message,
    });
  }
};

export const deleteWhyGudMedPage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPage = await WhyGudMedPage.findByIdAndDelete(id);
    if (!deletedPage) {
      console.warn(`⚠️ DELETE operation failed. Why GudMed Page with ID ${id} not found.`);
      return res.status(404).json({ success: false, message: "Why GudMed Page not found" });
    }

    console.log(`✅ DELETE operation performed. ID: ${id}`);

    // Notify clients about the deletion
    notifyClients("whyGudMedUpdated", { _id: id, deleted: true });

    res.status(200).json({ success: true, message: "Why GudMed Page deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting Why GudMed Page:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting Why GudMed Page",
      error: error.message,
    });
  }
};