import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";

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
