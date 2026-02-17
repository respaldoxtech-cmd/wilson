const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET all messages (optionally filter by contactId)
router.get('/', async (req, res) => {
    try {
        const { contactId } = req.query;
        const query = contactId ? { contactId } : {};
        const messages = await Message.find(query).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new message
router.post('/', async (req, res) => {
    const message = new Message(req.body);
    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
