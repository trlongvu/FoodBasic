const OrderModel = require('../models/order.model');
const CartModel = require('../models/cart.model');
const { PER_PAGE } = require('../constants/common');
const ErrorResponse = require('../helpers/ErrorResponse');
const { validateCreateOrder } = require('../validations/order.valid');

module.exports = {
  createOrder: async (req, res) => {
    const body = req.body;
    const { error, value } = validateCreateOrder(body);

    if (error) {
      throw new ErrorResponse(400, error.message);
    }

    const newOrder = new OrderModel(value);
    await newOrder.save();
    await CartModel.findByIdAndUpdate(
      value.cart_id,
      { is_order: true },
      { new: true },
    );

    return res.status(201).json({
      statusCode: 201,
      message: 'Tạo đơn hàng thành công',
      newOrder,
    });
  },
  getOrder: async (req, res) => {
    const { search, status, page = 1 } = req.query;
    const query = {};

    if (page < 1) {
      throw new ErrorResponse(400, 'Số trang không hợp lệ');
    }

    if (search) {
      query.$or = [
        { customer: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) query.status = status;

    const orders = await OrderModel.find(query)
      .populate({
        path: 'cart_id',
        populate: [
          {
            path: 'account_id',
          },
          {
            path: 'items.food_id',
          },
        ],
      })
      .limit(PER_PAGE)
      .skip(PER_PAGE * (page - 1))
      .sort({ createdAt: -1 })
      .exec();

    const totalOrders = await OrderModel.countDocuments(query);
    if (totalOrders === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: 'Không tìm thấy đơn hàng nào',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Lấy danh sách đơn hàng thành công',
      orders,
      totalOrders,
      page,
      totalPage: Math.ceil(totalOrders / PER_PAGE),
    });
  },
  getOrderByAccount: async (req, res) => {
    const { account_id } = req.params;
    const { page = 1 } = req.query;

    if (page < 1) {
      throw new ErrorResponse(400, 'Số trang không hợp lệ');
    }

    const carts = await CartModel.find({ account_id, is_order: true })
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE);

    const orders = await Promise.all(
      carts.map(async (cart) => {
        const order = await OrderModel.findOne({
          cart_id: cart._id,
        });
        return order;
      }),
    );
    return res.status(200).json({
      statusCode: 200,
      message: 'Lấy danh sách đơn hàng thành công',
      orders,
    });
  },
};
