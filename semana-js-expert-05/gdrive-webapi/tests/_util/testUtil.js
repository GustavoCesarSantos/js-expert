import { describe, expect, test, jest, beforeAll } from "@jest/globals";
import { Readable, Writable, Transform } from "node:stream";

export default class TestUtil {
  static mockDateNow(mockImplementationPeriods) {
    const now = jest.spyOn(global.Date, "now");
    mockImplementationPeriods.forEach((time) => {
      now.mockReturnValueOnce(time);
    });
  }

  static getTimeFromDate(dateString) {
    return new Date(dateString).getTime();
  }

  static generateReadableStream(data) {
    return new Readable({
      objectMode: true,
      read() {
        for (const item of data) {
          this.push(item);
        }
        this.push(null);
      },
    });
  }

  static generateTransformStream(fn) {
    return new Transform({
      objectMode: true,
      transform(chunk, encoding, cb) {
        fn(chunk);
        cb(null, chunk);
      },
    });
  }

  static generateWritableStream(fn) {
    return new Writable({
      objectMode: true,
      write(chunk, encoding, cb) {
        fn(chunk);
        cb(null, chunk);
      },
    });
  }
}
