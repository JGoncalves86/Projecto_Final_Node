const Joi = require('joi');

const createMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).required(),
  flatId: Joi.string().length(24).hex().required(),
  receiverId: Joi.string().length(24).hex().required(),
});


module.exports = {
  createMessageSchema,
};
