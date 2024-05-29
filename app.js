import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import path from "node:path";
import routes from "./routes/index.js";

const app = express();

const { DB_URI } = process.env;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.resolve("public", "avatars")));
app.use("/api", routes);

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
