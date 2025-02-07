const CartModel = require('../models/cart.model');

module.exports = {
  addToCart: async (req, res) => {
    const { account_id, food_id, quantity = 1 } = req.body;
    let cart = await CartModel.findOne({
      account_id,
      is_order: false,
    });

    if (!cart) {
      cart = new CartModel({
        account_id,
        items: [
          {
            food_id,
            quantity: quantity,
          },
        ],
      });
      await cart.save();
    } else {
      const existingItem = cart.items.find((item) => item.food_id == food_id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ food_id, quantity });
      }
      await cart.save();
    }
    res.status(201).json({
      statusCode: 201,
      message: 'Đã thêm món ăn vào giỏ hàng',
      cart,
    });
  },
  getCart: async (req, res) => {
    const { account_id } = req.params;
    const cart = await CartModel.findOne({
      account_id,
      is_order: false,
    }).populate('items.food_id');
    res.status(200).json({
      statusCode: 200,
      message: 'Lấy giỏ hàng thành công',
      cart,
    });
  },
  deleteItem: async (req, res) => {
    const { account_id, food_id } = req.params;
    const cart = await CartModel.findOne({
      account_id,
      is_order: false,
    });
    cart.items = cart.items.filter((item) => item.food_id._id != food_id);
    await cart.save();
    res.status(200).json({
      statusCode: 200,
      message: 'Xóa món ăn khỏi giỏ hàng thành công',
      cart,
    });
  },
  deleteCart: async (req, res) => {
    const { _id } = req.params;
    const deleteCart = await CartModel.findByIdAndDelete(_id);
    res.status(200).json({
      statusCode: 200,
      message: 'Xóa giỏ hàng thành công',
      deleteCart,
    });
  },
};
