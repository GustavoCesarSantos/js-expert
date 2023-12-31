import { describe, test, expect, jest } from "@jest/globals";
import { Routes } from "../../src/routes";

describe("Routes test suite", () => {
  describe("setSocketInstance", () => {
    test("Should store io instance", () => {
      const routes = new Routes();
      const ioObj = {
        to: (id) => {},
        emit: (event, message) => {},
      };
      routes.setSocketInstance(ioObj);
      expect(routes.io).toStrictEqual(ioObj);
    });
  });

  describe("handle", () => {
    const defaultParams = {
      request: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        method: "",
        body: {},
      },
      response: {
        writeHead: jest.fn(),
        setHeader: jest.fn(),
        end: jest.fn(),
      },
    };

    test("it should set any request with CORS enabled", () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.request.method = "inexistent";
      routes.handle(params.request, params.response);
      expect(params.response.setHeader).toHaveBeenCalledWith(
        "Access-Control-Allow-Origin",
        "*"
      );
    });

    test("Given an inexistent route it should choose default route", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.request.method = "inexistent";
      await routes.handle(params.request, params.response);
      expect(params.response.end).toHaveBeenCalledWith("Hello World");
    });

    test("Given method OPTIONS it should choose options route", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.request.method = "OPTIONS";
      await routes.handle(params.request, params.response);
      expect(params.response.writeHead).toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalled();
    });

    test("Given method POST it should choose post route", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.request.method = "POST";
      jest.spyOn(routes, routes.post.name).mockResolvedValue();
      await routes.handle(params.request, params.response);
      expect(routes.post).toHaveBeenCalled();
    });

    test("Given method GET it should choose get route", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.request.method = "GET";
      jest.spyOn(routes, routes.get.name).mockResolvedValue();
      await routes.handle(params.request, params.response);
      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe("get", () => {});
});
