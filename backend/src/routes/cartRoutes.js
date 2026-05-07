const express = require('express');
const Cart = require('../models/Cart');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

function cartQuantity(items) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

router.get('/', requireAuth, async (req, res) => {
  const cart = await getOrCreateCart(req.user.userId);
  res.json({ items: cart.items, cartQuantity: cartQuantity(cart.items) });
});

router.post('/items', requireAuth, async (req, res) => {
  const { productId, quantityDelta = 1 } = req.body;
  if (!productId) {
    return res.status(400).json({ message: 'productId is required' });
  }

  const cart = await getOrCreateCart(req.user.userId);
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += Number(quantityDelta) || 1;
  } else {
    cart.items.push({ productId, quantity: Math.max(1, Number(quantityDelta) || 1), deliveryOptionId: '1' });
  }

  cart.items = cart.items.filter((item) => item.quantity > 0);
  await cart.save();
  return res.status(201).json({ items: cart.items, cartQuantity: cartQuantity(cart.items) });
});

router.patch('/items/:productId', requireAuth, async (req, res) => {
  const { productId } = req.params;
  const { quantity, deliveryOptionId } = req.body;

  const cart = await getOrCreateCart(req.user.userId);
  const existingItem = cart.items.find((item) => item.productId === productId);
  if (!existingItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  if (quantity !== undefined) {
    const parsedQuantity = Number(quantity);
    if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ message: 'quantity must be at least 1' });
    }
    existingItem.quantity = parsedQuantity;
  }

  if (deliveryOptionId !== undefined) {
    existingItem.deliveryOptionId = String(deliveryOptionId);
  }

  await cart.save();
  return res.json({ items: cart.items, cartQuantity: cartQuantity(cart.items) });
});

router.delete('/items/:productId', requireAuth, async (req, res) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user.userId);
  cart.items = cart.items.filter((item) => item.productId !== productId);
  await cart.save();
  return res.json({ items: cart.items, cartQuantity: cartQuantity(cart.items) });
});

module.exports = router;
