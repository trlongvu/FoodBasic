const { PER_PAGE } = require('../constants/common');
const ErrorResponse = require('../helpers/ErrorResponse');
const FoodModel = require('../models/food.model');
const CategoryModel = require('../models/category.model');
const {
  validateCreateFood,
  validateUpdateFood,
} = require('../validations/food.valid');

module.exports = {
  createFood: async (req, res) => {
    const body = req.body;

    const { error, value } = validateCreateFood(body);

    if (error) {
      throw new ErrorResponse(400, error.message);
    }

    const newFood = new FoodModel(value);
    await newFood.save();

    return res.status(201).json({
      statusCode: 201,
      message: 'Tạo món ăn thành công',
      newFood,
    });
  },
  getFoods: async (req, res) => {
    const {
      search,
      category_id,
      minPrice,
      maxPrice,
      address,
      page = 1,
    } = req.query;

    if (page < 1) {
      throw new ErrorResponse(400, 'Số trang không hợp lệ');
    }

    if (minPrice < 0 || maxPrice < 0 || maxPrice <= minPrice) {
      throw new ErrorResponse(400, 'Giá tiền không hợp lệ');
    }

    let query = {};

    if (search) {
      const categories = await CategoryModel.find({
        name: { $regex: `.*${search}.*`, $options: 'i' },
      }).select('_id');
      const categoryIds = categories.map((x) => x._id);
      query.$or = [
        { name: { $regex: `.*${search}.*`, $options: 'i' } },
        { category_id: { $in: categoryIds } },
      ];
    }

    if (category_id) query.category_id = category_id;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    if (address) query.address = { $regex: `.*${address}.*`, $options: 'i' };
    const foods = await FoodModel.find(query)
      .populate('category_id', '_id name')
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE)
      .sort({ createdAt: -1 })
      .exec();

    const totalFood = await FoodModel.countDocuments(query);
    if (totalFood === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: 'Danh sách món ăn trống',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Danh sách món ăn',
      foods,
      totalFood,
      page,
      totalPage: Math.ceil(totalFood / PER_PAGE),
    });
  },
  getFood: async (req, res) => {
    const { _id } = req.params;

    const Food = await FoodModel.findById(_id);

    return res.status(200).json({
      statusCode: 200,
      message: 'Chi tiết món ăn',
      Food,
    });
  },
  updateFood: async (req, res) => {
    const { _id } = req.params;
    const body = req.body;

    const { error, value } = validateUpdateFood(body);

    if (error) {
      throw new ErrorResponse(400, error.message);
    }

    const updateFood = await FoodModel.findByIdAndUpdate(_id, value, {
      new: true,
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Cập nhật món ăn thành công',
      updateFood,
    });
  },
  deleteFood: async (req, res) => {
    const { _id } = req.params;

    const deleteFood = await FoodModel.findByIdAndDelete(_id);

    return res.status(200).json({
      statusCode: 200,
      message: 'Xóa món ăn thành công',
      deleteFood,
    });
  },
};
