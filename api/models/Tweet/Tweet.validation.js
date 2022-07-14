const Joi = require("joi");
const { REGEX } = require("../../configs/constant");

const CreateTweetSchema = Joi.object({
  //   user: Joi.string().regex(REGEX.OBJECT_ID).required(),
  description: Joi.string().min(1).max(300).required().trim(),
  isFijado: Joi.bool().default(false),
});

const ValidationRouterParametersSchema = Joi.object({
  page: Joi.string().regex(/\d+/).default(1),
  per_page: Joi.string().regex(/\d+/).default(20)
})

const ValidationTweetPaginationSchema = Joi.object({
  datetime: Joi.string().regex(/^\d+$/),
  per_page: Joi.string().regex(/^\d+$/).default(20)
})

module.exports = {
  CreateTweetSchema,
  ValidationRouterParametersSchema,
  ValidationTweetPaginationSchema
};
