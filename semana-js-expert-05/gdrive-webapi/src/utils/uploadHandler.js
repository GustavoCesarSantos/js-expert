import { pipeline } from "node:stream/promises";
import fs from "node:fs";

import Busboy from "busboy";

import { logger } from "./pinoLogger";

export default class UploadHandler {
  constructor({ io, socketId, downloadsFolder }) {
    this.io = io;
    this.socketId = socketId;
    this.downloadsFolder = downloadsFolder;
    this.ON_UPLOAD_EVENT = "file-upload";
  }

  canExecute(lastExecution) {}

  handleFileBytes(filename) {
    this.lastMessageSent = Date.now();
    async function* handleData(data) {
      let processedAlready = 0;
      for await (const chunk of data) {
        yield chunk;
        processedAlready += chunk.length;
        if (!this.canExecute(this.lastMessageSent)) {
          continue;
        }
        this.io
          .to(this.socketId)
          .emit(this.ON_UPLOAD_EVENT, { processedAlready, filename });
        logger.info(
          `File [${filename}] got ${processedAlready} bytes to ${this.socketId}`
        );
      }
    }
    return handleData.bind(this);
  }

  async onFile(fieldName, file, filename) {
    const saveTo = `${this.downloadsFolder}/${filename}`;
    await pipeline(
      file,
      this.handleFileBytes(filename),
      fs.createWriteStream(saveTo)
    );
    logger.info(`File [${filename}] finished`);
  }

  registerEvents(headers, onFinish) {
    const busboy = new Busboy({ headers });
    busboy.on("file", this.onFile.bind(this));
    busboy.on("finish", onFinish);
    return busboy;
  }
}
