const Joi = require('joi');

const createMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).required(),
  flatId: Joi.string().length(24).hex().required(), // ObjectId
});

module.exports = {
  createMessageSchema,
};
