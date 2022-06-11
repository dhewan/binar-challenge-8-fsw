const request = require("supertest");
const app = require("../../app");

describe("POST /v1/auth/login", () => {
    const email = "Johnny@binar.co.id";
    const password = "123456";
    const wrongEmail = "invalid@binar.co.id";
    const wrongPassword = "invalid";
  
    it("should response with 201 as status code", async () => {
      return request(app)
        .post("/v1/auth/login")
        .set("Content-Type", "application/json") 
        .send({email,password})
        .then((res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body).toEqual({
            accessToken: expect.any(String),
          });
        });
    });
  
    it("should response with 404 as status code", async () => {
      return request(app)
        .post("/v1/auth/login")
        .set("Content-Type", "application/json") 
        .send({
          email: wrongEmail,
          password,
        })
        .then((res) => {
          expect(res.statusCode).toBe(404);
          expect(res.body).toEqual({
            error: {
              name: expect.any(String),
              message: expect.any(String),
              details: {
                email: expect.any(String),
              },
            },
          });
        });
    });
  
    it("should response with 401 as status code", async () => {
      return request(app)
        .post("/v1/auth/login")
        .set("Content-Type", "application/json") 
        .send({
          email,
          password: wrongPassword,
        })
        .then((res) => {
          expect(res.statusCode).toBe(401);
          expect(res.body).toEqual({
            error: {
              name: expect.any(String),
              message: expect.any(String),
              details: expect.any(Object),
            },
          });
        });
    });
  });