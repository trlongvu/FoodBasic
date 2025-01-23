const Joi = require('joi');

const createAccountSchema = Joi.object({
  username: Joi.string().min(1).max(50).required().messages({
    'string.min': `Tên tài khoản tối thiểu phải có {#limit} ký tự`,
    'string.max': `Tên tài khoản tối đa là {#limit} ký tự`,
    'any.required': `Yêu cầu phải có tên tài khoản`,
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': `Mật khẩu tối thiểu phải có {#limit} ký tự`,
    'any.required': `Yêu cầu phải có mật khẩu`,
  }),
  phone: Joi.string()
    .pattern(new RegExp('^[0-9]{10,12}$'))
    .required()
    .messages({
      'string.pattern.base': `Số điện thoại phải chứa 10-12 chữ số`,
      'any.required': `Yêu cầu phải có Số điện thoại`,
    }),
  address: Joi.string().min(4).max(100).required().messages({
    'string.min': `Địa chỉ không hợp lệ`,
    'string.max': `Địa chỉ tối đa là {#limit} ký tự`,
    'any.required': `Yêu cầu phải có địa chỉ`,
  }),
});

const updateAccountSchema = Joi.object({
  username: Joi.string().min(1).max(50).optional().messages({
    'string.min': `Tên tài khoản tối thiểu phải có {#limit} ký tự`,
    'string.max': `Tên tài khoản tối đa là {#limit} ký tự`,
  }),
  password: Joi.string().min(8).optional().messages({
    'string.min': `Mật khẩu tối thiểu phải có {#limit} ký tự`,
  }),
  phone: Joi.string()
    .pattern(new RegExp('^[0-9]{10,12}$'))
    .optional()
    .messages({
      'string.pattern.base': `Số điện thoại phải chứa 10-12 chữ số`,
    }),
  address: Joi.string().min(4).max(100).optional().messages({
    'string.min': `Địa chỉ không hợp lệ`,
    'string.max': `Địa chỉ tối đa là {#limit} ký tự`,
  }),
})
  .min(1)
  .messages({ 'object.min': `Yêu cầu tối thiểu 1 trường để update` });

module.exports = {
  validateCreateAccount: (body) => createAccountSchema.validate(body),
  validateUpdateAccount: (body) => updateAccountSchema.validate(body),
};
