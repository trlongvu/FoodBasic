const Joi = require('joi');

const createFoodSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.base': `Tên món ăn phải là kiểu text`,
    'string.min': `Tên món ăn tối thiểu {#limit} ký tự`,
    'any.required': `Yêu cầu phải có tên món ăn`,
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': `Giá tiền phải là số`,
    'number.min': `Giá tiền tối thiểu là {#limit}`,
    'any.required': `Yêu cầu phải có giá tiền`,
  }),
  img: Joi.string().uri().required().messages({
    'string.empty': `Ảnh không được để trống`,
    'string.uri': `Ảnh phải là URL hợp lệ`,
    'any.required': `Yêu cầu phải có ảnh`,
  }),
  address: Joi.string().min(4).max(100).required().messages({
    'string.base': `Địa chỉ phải là chuỗi ký tự`,
    'string.min': `Địa chỉ không hợp lệ`,
    'string.max': `Địa chỉ tối đa là {#limit} ký tự`,
    'any.required': `Yêu cầu phải có địa chỉ`,
  }),
  category_id: Joi.string().required().messages({
    'string.base': `Mã danh mục phải là chuỗi ký tự`,
    'string.empty': `Mã danh mục không được để trống`,
    'any.required': `Yêu cầu phải có mã danh mục cho món ăn`,
  }),
});

const updateFoodSchema = Joi.object({
  name: Joi.string().min(2).optional().messages({
    'string.min': `Tên món ăn tối thiểu {#limit} ký tự`,
  }),
  price: Joi.number().min(0).optional().messages({
    'number.base': `Giá tiền phải là số`,
    'number.min': `Giá tiền tối thiểu là {#limit}`,
  }),
  img: Joi.string().uri().optional().messages({
    'string.empty': `Ảnh không được để trống`,
    'string.uri': `Ảnh phải là URL hợp lệ`,
  }),
  address: Joi.string().min(4).max(100).optional().messages({
    'string.base': `Địa chỉ phải là chuỗi ký tự`,
    'string.min': `Địa chỉ không hợp lệ`,
    'string.max': `Địa chỉ tối đa là {#limit} ký tự`,
  }),
  category_id: Joi.string().optional().messages({
    'string.base': `Danh mục phải là chuỗi ký tự`,
    'string.empty': `Danh mục không được để trống`,
  }),
})
  .min(1)
  .messages({ 'object.min': `Yêu cầu tối thiểu 1 trường để update` });

module.exports = {
  validateCreateFood: (body) => createFoodSchema.validate(body),
  validateUpdateFood: (body) => updateFoodSchema.validate(body),
};
