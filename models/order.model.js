const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    total_money: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ['Online', 'On Delivery'],
      default: 'On Delivery',
    },
    is_payment: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'confirm', 'ship', 'receive'],
      default: 'pending',
    },
    cart_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'cart',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('order', orderSchema);
