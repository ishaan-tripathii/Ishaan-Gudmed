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
    console.log('Creating page with data:', { titleDesktop, titleMobile, gradientWords, gradient, benefits, slug });
    const page = new Page({ titleDesktop, titleMobile, gradientWords, gradient, benefits, slug });
    const savedPage = await page.save();
    console.log('Created page:', savedPage);
    notifyClients('pageCreated', savedPage);
    res.status(201).json(savedPage);
  } catch (error) {
    console.error('Create page error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Update request for id:', id);
    console.log('Update request body:', req.body);
    const { titleDesktop, titleMobile, gradientWords, gradient, benefits, slug } = req.body;
    const page = await Page.findByIdAndUpdate(
      id,
      { titleDesktop, titleMobile, gradientWords, gradient, benefits, slug },
      { new: true, runValidators: true }
    );
    if (!page) {
      console.log('Page not found for id:', id);
      return res.status(404).json({ message: 'Page not found' });
    }
    console.log('Updated page (Mongoose doc):', page); // Log the Mongoose document
    const pageData = page.toJSON(); // Convert to plain JSON
    console.log('Converted pageData:', pageData); // Log the result of toJSON
    notifyClients('pageUpdated', pageData); // Emit the converted data
    res.json(pageData);
  } catch (error) {
    console.error('Update page error:', error.message, error.stack);
    res.status(400).json({ message: error.message });
  }
};

const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Delete request for id:', id);
    const page = await Page.findByIdAndDelete(id);
    if (!page) {
      console.log('Page not found for id:', id);
      return res.status(404).json({ message: 'Page not found' });
    }
    console.log('Deleted page slug:', page.slug);
    notifyClients('pageDeleted', page.slug);
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export { getPages, createPage, updatePage, deletePage };