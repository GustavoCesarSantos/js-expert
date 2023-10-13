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
    test("Given an inexistent route it should choose default route", () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.request.method = "inexistent";
      routes.handle(params.request, params.response);
      expect(params.response.end).toHaveBeenCalledWith("Hello World");
    });
  });
});
