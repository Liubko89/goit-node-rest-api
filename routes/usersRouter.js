import express from "express";
import { login, register } from "../controllers/auth.js";

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);

export default usersRouter;
