import express from "express";
import authRouter from "./auth.js";
import contactsRouter from "./contacts.js";
import auth from "../middlewares/auth.js";

const router = express.Router();
router.use("/contacts", auth, contactsRouter);
router.use("/users", authRouter);

export default router;
