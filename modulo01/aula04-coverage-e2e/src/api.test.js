const { describe, it } = require("mocha");
const request = require("supertest");
const { deepStrictEqual } = require("node:assert");

const app = require("./api");

describe("API Suite test", () => {
  describe("/contact", () => {
    it("should request the contact page and return HTTP Status 200", async () => {
      const response = await request(app).get("/contact").expect(200);
      deepStrictEqual(response.text, "contact us page");
    });

    it("should request an inexsistent route /hi and redirect to /hello", async () => {
      const response = await request(app).get("/hi").expect(200);
      deepStrictEqual(response.text, "Hello World!");
    });

    it("should login successfully on the login route and return HTTP Status 200", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "teste", password: "teste" })
        .expect(200);
      deepStrictEqual(response.text, "Login has succeeded!");
    });

    it("should unauthorized a request when requesting it using wrong credentials and return HTTP Status 401", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "fail", password: "teste" })
        .expect(401);
      deepStrictEqual(response.text, "Loggin failed!");
    });
  });
});
