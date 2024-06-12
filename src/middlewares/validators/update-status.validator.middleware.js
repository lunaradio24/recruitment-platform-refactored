import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { APPLICATION_STATUSES } from '../../constants/resume.constant.js';

const schema = Joi.object({
  applicationStatus: Joi.string()
    .required()
    .valid(...APPLICATION_STATUSES)
    .messages({
      'any.required': MESSAGES.RESUMES.COMMON.STATUS.REQUIRED,
      'any.only': MESSAGES.RESUMES.COMMON.STATUS.INVALID_TYPE,
    }),
  reason: Joi.string().required().messages({
    'any.required': MESSAGES.RESUMES.COMMON.REASON.REQUIRED,
  }),
});

export const updateStatusValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
