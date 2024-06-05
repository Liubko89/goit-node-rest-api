import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";
import { verificationEmailSchema } from "../schemas/verificationSchema.js";
import { sendMail } from "../mail.js";
import "dotenv/config";

const { MY_EMAIL, PORT } = process.env;

export const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400);
    const tmpPath = req.file.path;
    const newPath = path.resolve("public", "avatars", req.file.filename);

    (await Jimp.read(tmpPath)).resize(250, 250).write(tmpPath);
    await fs.rename(tmpPath, newPath);

    const newAvatarURL = `/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: newAvatarURL },
      { new: true }
    );
    if (!user) throw HttpError(401, "Not authorized");

    res.json({ avatarURL: newAvatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) throw HttpError(404, "User not found");

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const secondEmailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { error } = verificationEmailSchema.validate(email);
    if (error) throw HttpError(400, error.message);

    const { verify, verificationToken } = await User.findOne({ email });

    if (!verify) {
      sendMail({
        to: email,
        from: MY_EMAIL,
        subject: "Email verification",
        text: `To verify your email click on the link http://localhost:3000/api/users/verify/${verificationToken}`,
        html: `<strong>To verify your email click on the <a href="http://localhost:${PORT}/api/users/verify/${verificationToken}">link</a></strong>`,
      });

      res.json({ message: "Verification email sent" });
    } else {
      throw HttpError(400, "Verification has already been passed");
    }
  } catch (error) {
    next(error);
  }
};
