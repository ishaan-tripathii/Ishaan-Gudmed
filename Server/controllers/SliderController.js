// controllers/pagesController.js
import Page from '../models/Slider.js';
import { notifyClients } from '../services/socket.js';

const getPages = async (req, res) => {
  try {
    const { slug } = req.query;
    const pages = slug ? await Page.findOne({ slug }) : await Page.find();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPage = async (req, res) => {
  try {
    const { titleDesktop, titleMobile, gradientWords, gradient, benefits, slug } = req.body;
    const page = new Page({ titleDesktop, titleMobile, gradientWords, gradient, benefits, slug });
    await page.save();
    notifyClients('pageCreated', page); // Updated to use 'pageCreated'
    res.status(201).json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { titleDesktop, titleMobile, gradientWords, gradient, benefits, slug } = req.body;
    const page = await Page.findByIdAndUpdate(
      id,
      { titleDesktop, titleMobile, gradientWords, gradient, benefits, slug },
      { new: true }
    );
    if (!page) return res.status(404).json({ message: 'Page not found' });
    const pageData = page.toJSON(); // Convert Mongoose document to plain JSON
    notifyClients('pageUpdated', pageData); // Updated to use 'pageUpdated'
    res.json(pageData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findByIdAndDelete(id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    notifyClients('pageDeleted', page.slug); // Updated to use 'pageDeleted'
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getPages, createPage, updatePage, deletePage };