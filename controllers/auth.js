import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { authSchema, updateStatusSchema } from "../schemas/authSchema.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import crypto from "node:crypto";
import { sendMail } from "../mail.js";

const { SECRET_KEY, PORT, MY_EMAIL } = process.env;

export const register = async (req, res, next) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) throw HttpError(409, "Email in use");

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    sendMail({
      to: email,
      from: MY_EMAIL,
      subject: "Email verification",
      text: `To verify your email click on the link http://localhost:3000/api/users/verify/${verificationToken}`,
      html: `<strong>To verify your email click on the <a href="http://localhost:${PORT}/api/users/verify/${verificationToken}">link</a></strong>`,
    });

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL: gravatar.url(email),
      verificationToken,
    });

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw HttpError(401, "Email or password is wrong");

    if (!user.verify) throw HttpError(401, "Email not verified");

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) throw HttpError(401, "Email or password is wrong");

    const token = jwt.sign(
      {
        id: user._id,
      },
      SECRET_KEY,
      { expiresIn: "23h" }
    );

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription })
      .end();
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription })
      .end();
  } catch (error) {
    next(error);
  }
};
