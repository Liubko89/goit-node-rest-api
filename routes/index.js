import express from "express";
import authRouter from "./auth.js";
import contactsRouter from "./contacts.js";

const router = express.Router();
router.use("/contacts", contactsRouter);
router.use("/users", authRouter);

export default router;
