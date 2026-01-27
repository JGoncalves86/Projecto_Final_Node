const Joi = require('joi');

// helper para validar idade a partir da birthDate
const isValidAge = (value, helpers) => {
  const birthDate = new Date(value);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 18 || age > 120) {
    return helpers.error('any.invalid');
  }

  return value;
};

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

const registerSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain letters, numbers and a special character',
    }),

  firstName: Joi.string().min(2).required(),

  lastName: Joi.string().min(2).required(),

  birthDate: Joi.date()
    .custom(isValidAge, 'age validation')
    .required()
    .messages({
      'any.invalid': 'User age must be between 18 and 120',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2),
  lastName: Joi.string().min(2),
  birthDate: Joi.date().custom(isValidAge, 'age validation'),
}).min(1); // obriga a enviar pelo menos um campo

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
};
