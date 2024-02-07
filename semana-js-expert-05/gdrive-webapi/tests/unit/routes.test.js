import { describe, test, expect, jest } from "@jest/globals";
import { Routes } from "../../src/routes";
import TestUtil from "../_util/testUtil";
import UploadHandler from "../../src/utils/uploadHandler";

describe("Routes test suite", () => {
  const request = TestUtil.generateReadableStream(["teste"]);
  const response = TestUtil.generateWritableStream(() => {});
  const defaultParams = {
    request: Object.assign(request, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: "",
      body: {},
    }),
    response: Object.assign(response, {
      writeHead: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
    }),
    values: () => Object.values(defaultParams),
  };
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

  describe("get", () => {
    test("Given method GET it should list all files downloaded", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.request.method = "GET";
      const filesMock = [
        {
          size: "338 kB",
          lastModified: "2023-12-29T03:13:14.855Z",
          owner: "system_user",
          file: "file_png",
        },
      ];
      jest
        .spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name)
        .mockResolvedValue(filesMock);

      await routes.handle(params.request, params.response);
      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(
        JSON.stringify(filesMock)
      );
    });
  });

  describe("post", () => {
    test("it should validate post route workflow", async () => {
      const routes = new Routes("/tmp");
      const options = {
        ...defaultParams,
      };
      options.request.method = "POST";
      options.request.url = "?socketId=10";
      jest
        .spyOn(
          UploadHandler.prototype,
          UploadHandler.prototype.registerEvents.name
        )
        .mockImplementation((headers, onFinish) => {
          const writable = TestUtil.generateWritableStream(() => {});
          writable.on("finish", onFinish);
          return writable;
        });
      await routes.handle(...options.values());
      expect(UploadHandler.prototype.registerEvents).toHaveBeenCalled();
      expect(options.response.writeHead).toHaveBeenCalledWith(200);
    });
  });
});
