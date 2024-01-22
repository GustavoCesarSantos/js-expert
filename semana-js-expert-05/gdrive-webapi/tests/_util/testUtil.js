import { Readable, Writable, Transform } from "node:stream";

export default class TestUtil {
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
