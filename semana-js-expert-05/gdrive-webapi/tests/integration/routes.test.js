import {
  describe,
  test,
  expect,
  jest,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import fs from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import TestUtil from "../_util/testUtil";
import { logger } from "../../src/utils/pinoLogger";
import { Routes } from "../../src/routes";

describe("Routes", () => {
  describe("getFilesStatus", () => {
    const ioObj = {
      to: (id) => ioObj,
      emit: (event, message) => {},
    };

    let defaultDownloadsFolder = "";
    beforeAll(async () => {
      defaultDownloadsFolder = await fs.promises.mkdtemp(
        join(tmpdir(), "downloads-")
      );
    });

    afterAll(async () => {
      await fs.promises.rm(defaultDownloadsFolder, { recursive: true });
    });

    beforeEach(() => {
      jest.spyOn(logger, "info").mockImplementation();
    });

    test("should upload file to the folder", async () => {
      const filename = "teste.jpg";
      const fileStream = fs.createReadStream(
        `./test/integration/mocks/${filename}`
      );
      const response = TestUtil.generateWritableStream(() => {});
      const form = new FormData();
      form.append("photo", fileStream);
      const defaultParams = {
        request: Object.assign(form, {
          headers: form.getHeaders(),
          method: "POST",
          url: "?socketId=10",
        }),
        response: Object.assign(response, {
          writeHead: jest.fn(),
          setHeader: jest.fn(),
          end: jest.fn(),
        }),
        values: () => Object.values(defaultParams),
      };
      const routes = new Routes(defaultDownloadsFolder);
      routes.setSocketInstance(ioObj);
      const dir = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dir).toEqual([]);
      await routes.handle(...defaultParams.values());
      const dir2 = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dir2).toEqual([filename]);
      expect(defaultParams.response.writeHead).toHaveBeenCalledWith(200);
      expect(defaultParams.response.end).toHaveBeenCalledWith(
        JSON.stringify({ result: "Files uploaded with success! " })
      );
    });
  });
});
