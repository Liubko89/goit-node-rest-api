import dotenv from "dotenv";
dotenv.config();

import supertest from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import User from "../../models/user.js";

mongoose.set("strictQuery", false);

const { DB_TEST_URI } = process.env;

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_URI);
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect(DB_TEST_URI);
  });

  test("login user", async () => {
    await supertest(app).post("/api/users/register").send({
      email: "testUser1@gmail.com",
      password: "123456",
    });

    const res = await supertest(app).post("/api/users/login").send({
      email: "testUser1@gmail.com",
      password: "123456",
    });

    const token = res.body.token;

    expect(res.statusCode).toBe(200);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);
    expect(token.match(/^[A-Za-z0-9-_+\/=]*$/)).toBeTruthy;

    expect(
      typeof res.body.user.email && typeof res.body.user.subscription
    ).toBe("string");
  });
});
