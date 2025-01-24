const { PER_PAGE } = require('../constants/common');
const ErrorResponse = require('../helpers/ErrorResponse');
const CategoryModel = require('../models/category.model');
const FoodModel = require('../models/food.model');
const {
  validateCreateCategory,
  validateUpdateCategory,
} = require('../validations/category.valid');

module.exports = {
  createCategory: async (req, res) => {
    const body = req.body;

    const { error, value } = validateCreateCategory(body);

    if (error) {
      throw new ErrorResponse(400, error.message);
    }

    const newCategory = new CategoryModel(value);
    await newCategory.save();

    return res.status(201).json({
      statusCode: 201,
      message: 'Tạo danh mục thành công',
      newCategory,
    });
  },
  getCategories: async (req, res) => {
    const { search, page = 1 } = req.query;

    if (page < 1) {
      throw new ErrorResponse(400, 'Số trang không hợp lệ');
    }

    let query = {};

    if (search) {
      query.name = { $regex: `.*${search}.*`, $options: 'i' };
    }
    const categories = await CategoryModel.find(query)
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE)
      .sort({ createdAt: -1 })
      .exec();

    const totalCategory = await CategoryModel.countDocuments(query);
    if (totalCategory === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: 'Danh sách danh mục trống',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Danh sách danh mục',
      categories,
      totalCategory,
      page,
      totalPage: Math.ceil(totalCategory / PER_PAGE),
    });
  },
  getCategory: async (req, res) => {
    const { _id } = req.params;

    const category = await CategoryModel.findById(_id);

    return res.status(200).json({
      statusCode: 200,
      message: 'Chi tiết danh mục',
      category,
    });
  },
  updateCategory: async (req, res) => {
    const { _id } = req.params;
    const body = req.body;

    const { error, value } = validateUpdateCategory(body);

    if (error) {
      throw new ErrorResponse(400, error.message);
    }

    const updateCategory = await CategoryModel.findByIdAndUpdate(_id, value, {
      new: true,
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Cập nhật danh mục thành công',
      updateCategory,
    });
  },
  deleteCategory: async (req, res) => {
    const { _id } = req.params;

    const is_food = await FoodModel.findOne({ category_id: _id });
    if (is_food) {
      return res.status(409).json({
        statusCode: 409,
        message: 'Không thể xóa danh mục này do tồn tại món ăn trong danh mục',
      });
    }

    const deleteCategory = await CategoryModel.findByIdAndDelete(_id);

    return res.status(200).json({
      statusCode: 200,
      message: 'Xóa danh mục thành công',
      deleteCategory,
    });
  },
};
