const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification.model/notification.model');
const { auth } = require('../middleware/User.Auth.Middleware');

// GET /api/notifications?limit=20&after=<lastId>
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 20, after } = req.query;
    const query = { userId: req.user._id };
    if (after) query._id = { $lt: after }; // pagination by id (newest first)
    const items = await Notification.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit));
    res.json(items);
  } catch (err) {
    console.error('GET /notifications', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error('PATCH /notifications/:id/read', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
