const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': `Tên danh mục phải là chữ`,
    'string.min': `Tên danh mục tối thiểu phải có {#limit} ký tự`,
    'any.required': `Yêu cầu phải có tên danh mục`,
  }),
  img: Joi.string().uri().required().messages({
    'string.empty': `Ảnh không được để trống`,
    'string.uri': `Ảnh phải là URL hợp lệ`,
    'any.required': `Yêu cầu phải có ảnh`,
  }),
});
const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).optional().messages({
    'string.min': `Tên danh mục tối thiểu {#limit} ký tự`,
  }),
  img: Joi.string().uri().optional().messages({
    'string.empty': `Ảnh không được để trống`,
    'string.uri': `Ảnh phải là URL hợp lệ`,
  }),
}).min(1);

module.exports = {
  validateCreateCategory: (body) => createCategorySchema.validate(body),
  validateUpdateCategory: (body) => updateCategorySchema.validate(body),
};
