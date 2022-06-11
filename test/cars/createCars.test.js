const request = require("supertest");
const app = require("../../app");

const name = "BR-V";
const price = 250000;
const size = "MEDIUM";
const image = "Dummy";

describe("POST /v1/create", () => {
  let car;
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBiaW5hci5jby5pZCIsImltYWdlIjpudWxsLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjU0ODY3NDk2fQ.vlSEcTRS2kJ1Lfx8i_uAZa9Ir7qHdLGEAQR6I1sy1nE"

  it("should response with 201 as status code", async () => {

    return request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name, price, size, image })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
          size: expect.any(String),
          image: expect.any(String),
          isCurrentlyRented: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
        car = res.body;
      });
  });

  it("should response with 401 as status code", async () => {
    const token = "coba"

    return request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name, price, size, image })
      .then((res) => {
        expect(res.status).toBe(401);
        if (res.body.details === null) {
          expect(res.body).toEqual({
            error: expect.objectContaining({
              name: expect.any(String),
              message: expect.any(String),
              details: null,
            }),
          });
        }
      });
  });

});