"use strict";
process.env.SECRET = "toes";

const { server } = require("../src/server"); // destructing assignment
const supertest = require("supertest");
const mockRequest = supertest(server);
const { db } = require("../src/auth/models/index");

let users = {
  admin: { username: "admin", password: "password", role: "admin" },
  editor: { username: "editor", password: "password", role: "editor" },
  writer: { username: "writer", password: "password", role: "writer" },
  user: { username: "user", password: "password", role: "user" },
};
beforeAll(async (done) => {
  await db.sync();
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});

Object.keys(users).forEach((userType) => {
  describe(`${userType} users V1 (Unauthenticated API) routes Test`, () => {
    it("Creating Model", async () => {
      const res = await mockRequest.post("/signup").send(users[userType]);
      const token = res.body.token;
      const response = await mockRequest
        .post("/api/v2/food")
        .send({
          name: "banana",
          calories: "100cal",
          type: "fruit",
        })
        .set("Authorization", `Bearer ${token}`);
      if (userType === "user") {
        expect(response.status).toBe(500);
      } else {
        expect(response.status).toBe(201);
      }
    });

    it("Get all Models", async () => {
      const res = await mockRequest
        .post("/signin")
        .auth(users[userType].username, users[userType].password);

      const token = res.body.token;
      const response = await mockRequest
        .get("/api/v2/food")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

      it("Get One Model", async () => {
        const res = await mockRequest
        .post("/signin")
        .auth(users[userType].username, users[userType].password);

      const token = res.body.token;
        const response = await mockRequest.get("/api/v2/food/1").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
      });

      it("update Models", async () => {
        const res = await mockRequest
        .post("/signin")
        .auth(users[userType].username, users[userType].password);
        const token = res.body.token;

        const response = await mockRequest.put("/api/v2/food/1").send({
          name: "apple",
          calories: "10cal",
          type: "fruit",
        }).set("Authorization", `Bearer ${token}`);

        if (userType === "user" || userType === "writer") {
        expect(response.status).toBe(500); } else {
          expect(response.status).toBe(200);
        }
      });

      it("Delete Models", async () => {
        const res = await mockRequest
        .post("/signin")
        .auth(users[userType].username, users[userType].password);
        const token = res.body.token;
        const response = await mockRequest.delete("/api/v2/food/2").set("Authorization", `Bearer ${token}`);
        if (userType === "admin" ) {
          expect(response.status).toBe(200); } else{
            expect(response.status).toBe(500);
          }
      });

  });
});
