import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { resolve } from "node:path";

import { describe, expect, test, jest, beforeAll } from "@jest/globals";

import UploadHandler from "../../../src/utils/uploadHandler";
import TestUtil from "../../_util/testUtil";
import { logger } from "../../../src/utils/pinoLogger";

describe("#UploadHandler test suite", () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => {},
  };

  beforeAll(() => {
    jest.spyOn(logger, "info").mockImplementation();
  });
  describe("registerEvents", () => {
    test("should call onFile and onFinish on Busboy instance", () => {
      const uploadHandler = new UploadHandler({
        io: ioObj,
        socketId: "01",
      });
      const fileStream = TestUtil.generateReadableStream([
        "chunk01",
        "chunk02",
        "chunk03",
      ]);
      jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue();
      const headers = {
        "content-type": "multipart/form-data; boundary=",
      };
      const onFinish = jest.fn();
      const busboyInstance = uploadHandler.registerEvents(headers, onFinish);
      busboyInstance.emit("file", "fieldname", fileStream, "filename.txt");
      expect(uploadHandler.onFile).toHaveBeenCalled();
    });
  });

  describe("onFile", () => {
    test("given a stream file it should save it on disk", async () => {
      const chunks = ["hey", "dude"];
      const downloadsFolder = "/tmp";
      const handler = new UploadHandler({
        io: ioObj,
        socketId: "01",
        downloadsFolder,
      });
      const onWrite = jest.fn();
      jest
        .spyOn(fs, fs.createWriteStream.name)
        .mockImplementation(() => TestUtil.generateWritableStream(onWrite));
      const onTransform = jest.fn();
      jest
        .spyOn(handler, handler.handleFileBytes.name)
        .mockImplementation(() =>
          TestUtil.generateTransformStream(onTransform)
        );
      const params = {
        fieldname: "video",
        file: TestUtil.generateReadableStream(chunks),
        filename: "mockFile.mov",
      };
      await handler.onFile(...Object.values(params));
      const expectFileName = resolve(handler.downloadsFolder, params.filename);
      expect(onWrite.mock.calls.join()).toEqual(chunks.join());
      expect(onTransform.mock.calls.join()).toEqual(chunks.join());
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectFileName);
    });
  });

  describe("handleFileBytes", () => {
    test("should( call emit function and it is a transform stream", async () => {
      jest.spyOn(ioObj, ioObj.to.name);
      jest.spyOn(ioObj, ioObj.emit.name);
      const handler = new UploadHandler({
        io: ioObj,
        socketId: "01",
      });
      const messages = ["hello"];
      const source = TestUtil.generateReadableStream(messages);
      const onWrite = jest.fn();
      const target = TestUtil.generateWritableStream(onWrite);
      jest.spyOn(handler, handler.canExecute.name).mockReturnValue(true);
      await pipeline(source, handler.handleFileBytes("filename.txt"), target);
      expect(ioObj.to).toHaveBeenCalledTimes(messages.length);
      expect(ioObj.emit).toHaveBeenCalledTimes(messages.length);
      expect(onWrite).toBeCalledTimes(messages.length);
      expect(onWrite.mock.calls.join()).toEqual(messages.join());
    });
  });

  describe("canExecute", () => {});
});
