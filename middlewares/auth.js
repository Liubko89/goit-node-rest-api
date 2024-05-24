import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import dotenv from "dotenv";
dotenv.config();

const auth = (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ", 2);
  if (bearer !== "Bearer") next(HttpError(401, "invalid token"));

  jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    if (err) next(HttpError(401, "invalid token"));
    req.user = { id: decode.id };
  });

  next();
};

export default auth;
