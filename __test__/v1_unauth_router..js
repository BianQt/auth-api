"use strict";

const { server } = require("../src/server"); // destructing assignment
const supertest = require("supertest");
const mockRequest = supertest(server);
const { db } = require("../src/auth/models/index");

beforeAll(async (done) => {
  await db.sync();
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});

describe("V1 (Unauthenticated API) routes Test", () => {
  // foods test

  it("can add a food", async () => {
    const response = await mockRequest.post("/api/v1/food").send({
      name: "banana",
      calories: "100cal",
      type: "fruit",
    });
    expect(response.status).toBe(201);
  });

  it("can get all food", async () => {
    const response = await mockRequest.get("/api/v1/food");
    expect(response.status).toBe(200);
  });

  it("can get one food", async () => {
    const response = await mockRequest.get("/api/v1/food/1");
    expect(response.status).toBe(200);
  });

  it("can update a food", async () => {
    const response = await mockRequest.put("/api/v1/food/1").send({
      name: "apple",
      calories: "10cal",
      type: "fruit",
    });
    expect(response.status).toBe(200);
  });

  it("can delete a food", async () => {
    const response = await mockRequest.delete("/api/v1/food/1");
    expect(response.status).toBe(200);
  });

   // clothes test

   it("can add a food", async () => {
    const response = await mockRequest.post("/api/v1/clothes").send({
      name: "banana",
      color: "100cal",
      type: "fruit",
    });
    expect(response.status).toBe(201);
  });

  it("can get all clothes", async () => {
    const response = await mockRequest.get("/api/v1/clothes");
    expect(response.status).toBe(200);
  });

  it("can get one clothes", async () => {
    const response = await mockRequest.get("/api/v1/clothes/1");
    expect(response.status).toBe(200);
  });

  it("can update a clothes", async () => {
    const response = await mockRequest.put("/api/v1/clothes/1").send({
      name: "banana",
      color: "100cal",
      type: "fruit",
    });
    expect(response.status).toBe(200);
  });

  it("can delete a clothes", async () => {
    const response = await mockRequest.delete("/api/v1/clothes/1");
    expect(response.status).toBe(200);
  });
});
