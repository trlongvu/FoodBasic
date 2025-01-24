const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../helpers/ErrorResponse');
const AccountModel = require('../models/account.model');
const { validateCreateAccount } = require('../validations/account.valid');

module.exports = {
  register: async (req, res) => {
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
  login: async (req, res) => {
    const { username, password } = req.body;

    const user = await AccountModel.findOne({ username });

    if (!user) {
      throw new ErrorResponse(404, 'Tên tài khoản hoặc mật khẩu không hợp lệ');
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      throw new ErrorResponse(404, 'Tên tài khoản hoặc mật khẩu không hợp lệ');
    }

    const payload = {
      _id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
    return res.status(200).json({
      statusCode: 200,
      message: 'Đăng nhập thành công',
      ...payload,
      token,
    });
  },
};
