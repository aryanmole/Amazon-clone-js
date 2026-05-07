const express = require('express');
const products = require('../../products.json');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, (_req, res) => {
  res.json({ products });
});

module.exports = router;
