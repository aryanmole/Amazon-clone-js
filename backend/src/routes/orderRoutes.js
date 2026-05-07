const express = require('express');
const dayjs = require('dayjs');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { requireAuth } = require('../middleware/authMiddleware');
const { getDeliveryOption } = require('../constants/deliveryOptions');
const products = require('../../products.json');

const router = express.Router();

function toSummary(order) {
  return {
    id: order._id,
    createdAt: order.createdAt,
    totalCents: order.totalCents,
    status: order.status,
    items: order.items.map((item) => ({
      id: item._id,
      productId: item.productId,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      expectedDeliveryDate: item.expectedDeliveryDate
    }))
  };
}

router.post('/checkout', requireAuth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.userId });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let itemsPriceCents = 0;
  let shippingPriceCents = 0;

  const orderItems = cart.items.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) {
      throw new Error(`Product not found: ${cartItem.productId}`);
    }

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const itemShipping = deliveryOption.priceCents;

    itemsPriceCents += product.priceCents * cartItem.quantity;
    shippingPriceCents += itemShipping;

    return {
      productId: product.id,
      name: product.name,
      image: product.image,
      priceCents: product.priceCents,
      quantity: cartItem.quantity,
      deliveryOptionId: deliveryOption.id,
      deliveryDays: deliveryOption.deliveryDays,
      shippingPriceCents: itemShipping,
      expectedDeliveryDate: dayjs().add(deliveryOption.deliveryDays, 'day').toDate()
    };
  });

  const taxCents = Math.round((itemsPriceCents + shippingPriceCents) * 0.1);
  const totalCents = itemsPriceCents + shippingPriceCents + taxCents;

  const order = await Order.create({
    userId: req.user.userId,
    items: orderItems,
    itemsPriceCents,
    shippingPriceCents,
    taxCents,
    totalCents,
    status: 'preparing'
  });

  cart.items = [];
  await cart.save();

  return res.status(201).json({ order: toSummary(order) });
});

router.get('/', requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json({ orders: orders.map(toSummary) });
});

router.get('/:orderId/items/:itemId/tracking', requireAuth, async (req, res) => {
  const { orderId, itemId } = req.params;
  const order = await Order.findOne({ _id: orderId, userId: req.user.userId });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const item = order.items.id(itemId);
  if (!item) {
    return res.status(404).json({ message: 'Order item not found' });
  }

  const startTime = new Date(order.createdAt).getTime();
  const endTime = new Date(item.expectedDeliveryDate).getTime();
  const now = Date.now();
  const ratio = Math.max(0, Math.min(1, (now - startTime) / (endTime - startTime || 1)));
  const progressPercent = Math.round(ratio * 100);

  const stage = progressPercent >= 100 ? 'delivered' : progressPercent >= 55 ? 'shipped' : 'preparing';

  res.json({
    orderId: order._id,
    item: {
      id: item._id,
      name: item.name,
      image: item.image,
      quantity: item.quantity
    },
    expectedDeliveryDate: item.expectedDeliveryDate,
    progressPercent,
    stage
  });
});

module.exports = router;
