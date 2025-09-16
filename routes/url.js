const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const { nanoid } = require('nanoid');
const QRCode = require('qrcode');

// POST /shorten
router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'originalUrl is required' });
    }

    const shortCode = nanoid(6);

    try {
        const newUrl = new Url({
            shortCode,
            originalUrl,
            createdAt: new Date(),
            clicks: 0
        });

        await newUrl.save();

        const fullShortUrl = `http://fastshrink.ml/${shortCode}`;
        const qrCode = await QRCode.toDataURL(fullShortUrl);

        res.json({ shortUrl: fullShortUrl, qrCode });

    } catch (error) {
        console.error("ERROR at /shorten route:", error);
        res.status(500).json({ error: 'Server error while creating short URL', details: error.message });
    }
});

// GET /:shortCode
router.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    try {
        const url = await Url.findOne({ shortCode });

        if (url) {
            url.clicks += 1;
            await url.save();
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error('Error retrieving URL:', error);
        res.status(500).json({ error: 'Error retrieving URL', details: error.message });
    }
});

module.exports = router;
