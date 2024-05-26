import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateUserStatus,
} from "../controllers/auth.js";
import authMiddleware from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, getCurrentUser);
authRouter.patch("/current", authMiddleware, updateUserStatus);

export default authRouter;
