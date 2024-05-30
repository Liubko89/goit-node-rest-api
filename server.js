import mongoose from "mongoose";
import app from "./app.js";
const { DB_URI } = process.env;

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
