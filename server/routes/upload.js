const express = require('express');
const router = express.Router();
const { uploadImage, uploadFile, uploadResume } = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const WorkOrder = require('../models/WorkOrder');

router.post('/profile-pic', protect, uploadImage.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(
      req.user.id || req.user._id,
      { profilePic: req.file.path },
      { new: true }
    );
    res.json({ url: req.file.path, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/portfolio', protect, uploadImage.array('portfolioImages', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
    const urls = req.files.map(f => f.path);
    const user = await User.findByIdAndUpdate(
      req.user.id || req.user._id,
      { $push: { portfolioImages: { $each: urls } } },
      { new: true }
    );
    res.json({ urls, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/portfolio', protect, async (req, res) => {
  try {
    const { url } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id || req.user._id,
      { $pull: { portfolioImages: url } },
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  '/resume',
  protect,
  uploadResume.single('resume'),
  async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(
      req.user.id || req.user._id,
      { resumeUrl: req.file.path },
      { new: true }
    );
    res.json({ url: req.file.path, user });
  } catch (err) {
    console.error("❌ Resume upload error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/submission/:orderId', protect, uploadFile.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
    const urls = req.files.map(f => f.path);
    const order = await WorkOrder.findByIdAndUpdate(
      req.params.orderId,
      { $push: { submissionFiles: { $each: urls } } },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ urls, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;