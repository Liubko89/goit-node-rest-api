import Joi from "joi";

export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const verificationEmailSchema = Joi.string()
  .pattern(emailRegexp)
  .required();
