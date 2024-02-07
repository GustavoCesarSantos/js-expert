import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { resolve } from "node:path";

import { describe, expect, test, jest, beforeAll } from "@jest/globals";

import UploadHandler from "../../../src/utils/uploadHandler";
import TestUtil from "../../_util/testUtil";
import { logger } from "../../../src/utils/pinoLogger";

class ioObj {
  to(id) {
    return new ioObj();
  }

  emit(event, message) {}
}

describe("#UploadHandler test suite", () => {
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
      jest.spyOn(ioObj.prototype, "to");
      jest.spyOn(ioObj.prototype, "emit");
      const handler = new UploadHandler({
        io: new ioObj(),
        socketId: "01",
      });
      const messages = ["hello"];
      const source = TestUtil.generateReadableStream(messages);
      const onWrite = jest.fn();
      const target = TestUtil.generateWritableStream(onWrite);
      jest.spyOn(handler, handler.canExecute.name).mockReturnValue(true);
      await pipeline(source, handler.handleFileBytes("filename.txt"), target);
      expect(ioObj.prototype.to).toHaveBeenCalledTimes(messages.length);
      expect(ioObj.prototype.emit).toHaveBeenCalledTimes(messages.length);
      expect(onWrite).toBeCalledTimes(messages.length);
      expect(onWrite.mock.calls.join()).toEqual(messages.join());
    });

    // test("giver message timerDelay as 2secs it should emit only two message during 2 seconds period", async () => {
    //   jest.spyOn(ioObj.prototype, "emit");
    //   const messageTimeDelay = 2000;
    //   const day = "2021-07-01 01:01";
    //   const onFirstLastMessageSent = TestUtil.getTimeFromDate(`${day}:00`);
    //   const onFirstCanExecute = TestUtil.getTimeFromDate(`${day}:02`);
    //   const onSecondUpdateLastMessageSent = onFirstCanExecute;
    //   const onSecondCanExecute = TestUtil.getTimeFromDate(`${day}:03`);
    //   const onThirdCanExecute = TestUtil.getTimeFromDate(`${day}:04`);
    //   TestUtil.mockDateNow([
    //     onFirstLastMessageSent,
    //     onFirstCanExecute,
    //     onSecondUpdateLastMessageSent,
    //     onSecondCanExecute,
    //     onThirdCanExecute,
    //   ]);
    //   const messages = ["msg1", "msg2", "msg3"];
    //   const expectedMessageSent = 2;
    //   const filename = "filename.avi";
    //   const source = TestUtil.generateReadableStream(messages);
    //   const handler = new UploadHandler({
    //     messageTimeDelay,
    //     io: new ioObj(),
    //     socketId: "01",
    //   });
    //   await pipeline(source, handler.handleFileBytes(filename));
    //   expect(ioObj.prototype.emit).toHaveBeenCalledTimes(expectedMessageSent);
    //   const [firstCallResult, secondCallResult] =
    //     ioObj.prototype.emit.mock.calls;
    //   expect(firstCallResult).toEqual([
    //     handler.ON_UPLOAD_EVENT,
    //     { processedAlready: "msg1".length, filename },
    //   ]);
    //   expect(secondCallResult).toEqual([
    //     handler.ON_UPLOAD_EVENT,
    //     { processedAlready: messages.join("").length, filename },
    //   ]);
    // });
  });

  describe("canExecute", () => {
    test("should return true when time is later than specified delay", () => {
      const uploadHandler = new UploadHandler({
        io: {},
        socketId: "",
        messageTimeDelay: 1000,
      });
      const tickNow = TestUtil.getTimeFromDate("2021-07-01 00:00:03");
      const tickThreeSecondBefore = TestUtil.getTimeFromDate(
        "2021-07-01 00:00:00"
      );
      TestUtil.mockDateNow([tickNow]);
      const result = uploadHandler.canExecute(tickThreeSecondBefore);
      expect(result).toBeTruthy();
    });
    test("should return false when time is not later than specified delay", () => {
      const uploadHandler = new UploadHandler({
        io: {},
        socketId: "",
        messageTimeDelay: 3000,
      });
      const tickNow = TestUtil.getTimeFromDate("2021-07-01 00:00:03");
      const tickThreeSecondBefore = TestUtil.getTimeFromDate(
        "2021-07-01 00:00:02"
      );
      TestUtil.mockDateNow([tickNow]);
      const result = uploadHandler.canExecute(tickThreeSecondBefore);
      expect(result).toBeFalsy();
    });
  });
});
