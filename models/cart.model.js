const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    is_order: {
      type: Boolean,
      default: false,
    },
    account_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'account',
    },
    items: [
      {
        food_id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'food',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('cart', cartSchema);
