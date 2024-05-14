import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import mongoose from "mongoose";

const app = express();

const { DB_URI } = process.env;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose.set("strictQuery", true);

async function run() {
  try {
    mongoose.connect(DB_URI);
    console.log("Database connection successful");
    app.listen(3000, () => {});
  } catch (error) {
    console.error("Database connection failure:", error);
    process.exit(1);
  }
}

run();
