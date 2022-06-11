const request = require("supertest");
const app = require("../../../app");

describe("PUT /v1/cars/:id", () => {
    let car;
  
    const name = "BR-V";
    const price = 250000;
    const size = "MEDIUM";
    const image = "Dummy";
  
    tokenAdmin ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBiaW5hci5jby5pZCIsImltYWdlIjpudWxsLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjU0ODY3NDk2fQ.vlSEcTRS2kJ1Lfx8i_uAZa9Ir7qHdLGEAQR6I1sy1nE"
    tokenCustomer = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG5ueSIsImVtYWlsIjoiam9obm55QGJpbmFyLmNvLmlkIiwiaW1hZ2UiOm51bGwsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJDVVNUT01FUiJ9LCJpYXQiOjE2NTQ4NjkwNjl9.WAe-OndC-DG6ddgGw8ixNf-E7D_5-tHFCEuR_U6isMM"
  
    beforeEach(async () => {
      car = await request(app)
        .post("/v1/cars")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
          name,
          price,
          size,
          image,
        });
      return car;
    });
  
    it("should response with 200 as status code", async () => {
      return request(app)
        .put(`/v1/cars/ ${car.body.id}`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ name, price, size, image })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual({});
        });
    });
  
    it("should response with 401 as status code", async () => {
      return request(app)
        .put(`/v1/cars/ ${car.body.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${tokenCustomer}`)
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
            return;
          }
          expect(res.body).toEqual({
            error: expect.objectContaining({
              name: expect.any(String),
              message: expect.any(String),
              details: expect.objectContaining({
                role: expect.any(String),
                reason: expect.any(String),
              }),
            }),
          });
        });
    });
  
  });