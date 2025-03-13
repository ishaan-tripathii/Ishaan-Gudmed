// import mongoose from "mongoose";
// import TechnologyPage from "../models/TechnologyPage.js";
// import { notifyClients } from "../services/socket.js";

// // Get all pages or a specific page by slug or ID
// export const getTechnologyPages = async (req, res) => {
//   try {
//     const { slug, id } = req.query;
//     let pages;
//     if (id) {
//       pages = await TechnologyPage.findById(id);
//       if (!pages) return res.status(404).json({ message: "Page not found" });
//       return res.json(pages);
//     } else if (slug) {
//       pages = await TechnologyPage.find({ slug });
//       if (pages.length === 0) return res.status(404).json({ message: "No pages found with this slug" });
//     } else {
//       pages = await TechnologyPage.find();
//     }
//     res.json(pages);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Create a new technology page
// export const createTechnologyPage = async (req, res) => {
//   try {
//     const page = new TechnologyPage(req.body);
//     await page.save();
//     notifyClients(page.slug);
//     res.status(201).json(page);
//   } catch (error) {
//     res.status(400).json({ message: "Failed to create page", error: error.message });
//   }
// };

// // Update an existing technology page
// export const updateTechnologyPage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid or missing page ID" });
//     }
//     const page = await TechnologyPage.findByIdAndUpdate(
//       id,
//       { ...req.body, updatedAt: Date.now() },
//       { new: true, runValidators: true }
//     );
//     if (!page) return res.status(404).json({ message: "Page not found" });
//     notifyClients(page.slug);
//     res.json(page);
//   } catch (error) {
//     res.status(400).json({ message: "Failed to update page", error: error.message });
//   }
// };

// // Delete a technology page
// export const deleteTechnologyPage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const page = await TechnologyPage.findByIdAndDelete(id);
//     if (!page) return res.status(404).json({ message: "Page not found" });
//     notifyClients(page.slug);
//     res.json({ message: "Page deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

import mongoose from "mongoose";
import TechnologyPage from "../models/TechnologyPage.js";
import { notifyClients } from "../services/socket.js";

/**
 * @desc Get all technology pages or a specific page by ID or slug
 * @route GET /api/technology-pages
 * @route GET /api/technology-pages/:id
 * @access Public
 */
export const getTechnologyPages = async (req, res) => {
  try {
    const { slug } = req.query;
    const { id } = req.params;

    let pages;
    if (id) {
      pages = await TechnologyPage.findById(id);
      if (!pages) {
        return res.status(404).json({
          success: false,
          message: "Page not found",
        });
      }
    } else if (slug) {
      pages = await TechnologyPage.find({ slug });
      if (!pages.length) {
        return res.status(404).json({
          success: false,
          message: "No pages found with this slug",
        });
      }
    } else {
      pages = await TechnologyPage.find();
    }

    res.status(200).json({
      success: true,
      data: pages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * @desc Create a new technology page
 * @route POST /api/technology-pages
 * @access Private (Authenticated Users Only)
 */
export const createTechnologyPage = async (req, res) => {
  try {
    // Fetch data from request body
    const requestData = req.body;

    // Create a new page using Mongoose's create method
    const page = await TechnologyPage.create(requestData);

    // Notify connected clients (if needed)
    notifyClients(page.slug);

    // Send success response
    return res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: page,
    });

  } catch (error) {
    // Handle errors
    return res.status(400).json({
      success: false,
      message: "Failed to create page",
      error: error.message,
    });
  }
};


/**
 * @desc Update an existing technology page
 * @route PUT /api/technology-pages/:id
 * @access Private (Authenticated Users Only)
 */
export const updateTechnologyPage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing page ID",
      });
    }

    const updatedPage = await TechnologyPage.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedPage) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    notifyClients(updatedPage.slug);
    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      data: updatedPage,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update page",
      error: error.message,
    });
  }
};

/**
 * @desc Delete a technology page
 * @route DELETE /api/technology-pages/:id
 * @access Private (Authenticated Users Only)
 */
export const deleteTechnologyPage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing page ID",
      });
    }

    const deletedPage = await TechnologyPage.findByIdAndDelete(id);
    if (!deletedPage) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    notifyClients(deletedPage.slug);
    res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
