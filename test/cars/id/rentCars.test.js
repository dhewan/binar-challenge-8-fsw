const request = require("supertest");
const app = require("../../../app");
const dayjs = require("dayjs");
dayjs().format();

describe("POST /v1/cars/:id/rent", () => {
  let car;
  let rentStartedAt = dayjs().add(1, "day");
  let rentEndedAt = dayjs(rentStartedAt).add(1, "day");

  rentStartedAt = rentStartedAt.$d;
  rentEndedAt = rentEndedAt.$d;

  tokenAdmin ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBiaW5hci5jby5pZCIsImltYWdlIjpudWxsLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjU0ODY3NDk2fQ.vlSEcTRS2kJ1Lfx8i_uAZa9Ir7qHdLGEAQR6I1sy1nE"
  tokenCustomer = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG5ueSIsImVtYWlsIjoiam9obm55QGJpbmFyLmNvLmlkIiwiaW1hZ2UiOm51bGwsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJDVVNUT01FUiJ9LCJpYXQiOjE2NTQ4NjkwNjl9.WAe-OndC-DG6ddgGw8ixNf-E7D_5-tHFCEuR_U6isMM"

  beforeAll(async () => {
    car = await request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        name: "BR-V",
        price: 120000,
        size: "MEDIUM",
        image: "Dummy BR-v",
      });

    return car;
  });

  it("should response with 201 as status code", async () => {
    return await request(app)
      .post("/v1/cars/" + car.body.id + "/rent")
      .set("Authorization", `Bearer ${tokenCustomer}`)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt, rentEndedAt })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(res.body);
      });
  });

  it("should response with 401 as status code", async () => {
    return await request(app)
      .post("/v1/cars/" + car.body.id + "/rent")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt, rentEndedAt })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.objectContaining({
              name: expect.any(String),
              message: expect.any(String),
              details: expect.objectContaining({
                role: expect.any(String),
                reason: expect.any(String),
              }),
            }),
          })
        );
      });
  });

  it("should response with 422 as status code", async () => {
    return await request(app)
      .post("/v1/cars/" + car.body.id + "/rent")
      .set("Authorization", `Bearer ${tokenCustomer}`)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt, rentEndedAt })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(res.body);
      });
  });
  
});