const { PER_PAGE } = require('../constants/common');
const ErrorResponse = require('../helpers/ErrorResponse');
const AccountModel = require('../models/account.model');
const {
  validateCreateAccount,
  validateUpdateAccount,
} = require('../validations/account.valid');

module.exports = {
  createAccount: async (req, res) => {
    const body = req.body;
    const { error, value } = validateCreateAccount(body);

    if (error) {
      throw new ErrorResponse(400, error.message);
    }

    const newAccount = new AccountModel(value);
    await newAccount.save();

    return res.status(201).json({
      statusCode: 201,
      message: 'Tạo tài khoản thành công',
      newAccount,
    });
  },
  getAccounts: async (req, res) => {
    const { search, role, page = 1 } = req.query;

    if (page < 1) {
      throw new ErrorResponse(400, 'Số trang không hợp lệ');
    }
    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { username: { $regex: `.*${search}.*`, $options: 'i' } },
          { address: { $regex: `.*${search}.*`, $options: 'i' } },
        ],
      };
    }

    if (role) query.role = role;
    const accounts = await AccountModel.find(query)
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE)
      .sort({ createdAt: -1 })
      .exec();
    const totalAccount = await AccountModel.countDocuments(query);
    if (totalAccount === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: 'Danh sách tài khoản trống',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Danh sách tài khoản',
      accounts,
      totalAccount,
      page,
      totalPage: Math.ceil(totalAccount / PER_PAGE),
    });
  },
  getAccount: async (req, res) => {
    const { _id } = req.params;
    const account = await AccountModel.findById(_id);

    return res.status(200).json({
      statusCode: 200,
      account,
    });
  },
  updateAccount: async (req, res) => {
    const { _id } = req.params;

    const body = req.body;
    const { error, value } = validateUpdateAccount(body);

    if (error) {
      throw new ErrorResponse(400, error.message);
    }

    const updateAccount = await AccountModel.findByIdAndUpdate(_id, value, {
      new: true,
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Cập nhật tài khoản thành công',
      updateAccount,
    });
  },
  deleteAccount: async (req, res) => {
    const { _id } = req.params;

    const deleteAccount = await AccountModel.findByIdAndDelete(_id);

    return res.status(200).json({
      statusCode: 200,
      message: 'Xóa tài khoản thành công',
      deleteAccount,
    });
  },
};
