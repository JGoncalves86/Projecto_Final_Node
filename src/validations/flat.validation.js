const Joi = require('joi');

const currentYear = new Date().getFullYear();

// CREATE FLAT
const createFlatSchema = Joi.object({
  city: Joi.string().required().trim(),
  streetName: Joi.string().required().trim(),
  streetNumber: Joi.string().required().trim(),
  areaSize: Joi.number().min(1).required(),
  hasAC: Joi.boolean().required(),
  yearBuilt: Joi.number().min(1800).max(currentYear).required(),
  rentPrice: Joi.number().min(0).required(),
  dateAvailable: Joi.date().required(),
  ownerId: Joi.string().length(24).hex().required(), // ObjectId
  images: Joi.array().items(Joi.string()).optional(),
});

// UPDATE FLAT
const updateFlatSchema = Joi.object({
  city: Joi.string().trim(),
  streetName: Joi.string().trim(),
  streetNumber: Joi.string().trim(),
  areaSize: Joi.number().min(1),
  hasAC: Joi.boolean(),
  yearBuilt: Joi.number().min(1800).max(currentYear),
  rentPrice: Joi.number().min(0),
  dateAvailable: Joi.date(),
  images: Joi.array().items(Joi.string()).optional(),
}).min(1); // exige pelo menos 1 campo

module.exports = {
  createFlatSchema,
  updateFlatSchema,
};
