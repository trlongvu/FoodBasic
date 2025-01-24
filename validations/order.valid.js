const Joi = require('joi');

const createOrderSchema = Joi.object({
  customer: Joi.string().min(3).required().messages({
    'string.base': 'Tên khách hàng phải là chuỗi ký tự',
    'string.min': 'Tên khách hàng phải có ít nhất {#limit} ký tự',
    'any.required': 'Yêu cầu phải có tên khách hàng',
  }),
  address: Joi.string().min(4).required().messages({
    'string.base': 'Địa chỉ phải là chuỗi ký tự',
    'string.min': 'Địa chỉ phải có ít nhất {#limit} ký tự',
    'any.required': 'Yêu cầu phải có địa chỉ',
  }),
  phone: Joi.string()
    .pattern(new RegExp('^[0-9]{10,12}$'))
    .required()
    .messages({
      'string.pattern.base': 'Số điện thoại phải chứa 10-12 chữ số',
      'any.required': 'Yêu cầu phải có số điện thoại',
    }),
  total_money: Joi.number().min(0).required().messages({
    'number.base': 'Tổng tiền phải là số',
    'number.min': 'Tổng tiền không được nhỏ hơn 0',
    'any.required': 'Yêu cầu phải có tổng tiền',
  }),
  payment_method: Joi.string().optional(),
  is_payment: Joi.string().optional(),
  status: Joi.string().optional(),
  cart_id: Joi.string().optional(),
});

const updateOrderSchema = Joi.object({
  customer: Joi.string().min(3).optional().messages({
    'string.base': 'Tên khách hàng phải là chuỗi ký tự',
    'string.min': 'Tên khách hàng phải có ít nhất {#limit} ký tự',
  }),
  address: Joi.string().min(5).optional().messages({
    'string.base': 'Địa chỉ phải là chuỗi ký tự',
    'string.min': 'Địa chỉ phải có ít nhất {#limit} ký tự',
  }),
  phone: Joi.string()
    .pattern(new RegExp('^[0-9]{10,12}$'))
    .optional()
    .messages({
      'string.pattern.base': 'Số điện thoại phải chứa 10-12 chữ số',
    }),
  total_money: Joi.number().min(0).optional().messages({
    'number.base': 'Tổng tiền phải là số',
    'number.min': 'Tổng tiền không được nhỏ hơn 0',
  }),
  payment_method: Joi.string().optional(),
  is_payment: Joi.boolean().optional(),
  status: Joi.string().optional(),
  cart_id: Joi.string().optional(),
})
  .min(1)
  .messages({ 'object.min': `Yêu cầu tối thiểu 1 trường để update` });

module.exports = {
  validateCreateOrder: (body) => createOrderSchema.validate(body),
  validateUpdateOrder: (body) => updateOrderSchema.validate(body),
};
