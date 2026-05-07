const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    priceCents: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    deliveryOptionId: { type: String, required: true },
    deliveryDays: { type: Number, required: true },
    shippingPriceCents: { type: Number, required: true },
    expectedDeliveryDate: { type: Date, required: true }
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true
    },
    itemsPriceCents: { type: Number, required: true },
    shippingPriceCents: { type: Number, required: true },
    taxCents: { type: Number, required: true },
    totalCents: { type: Number, required: true },
    status: {
      type: String,
      enum: ['preparing', 'shipped', 'delivered'],
      default: 'preparing'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
