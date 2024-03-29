import { pipeline } from "node:stream/promises";
import { join } from "node:path";
import { createWriteStream } from "node:fs";
import Busboy from "busboy";

import { logger } from "./util.js";

const ON_UPLOAD_EVENT = "file-uploaded";

export class UploadHandler {
    #io;
    #socketId;

    constructor({ io, socketId }) {
        this.#io = io;
        this.#socketId = socketId;
    }

    registerEvents(headers, onFinish) {
        const busboy = new Busboy({ headers });
        busboy.on("file", this.#onFile.bind(this));
        busboy.on("finish", onFinish);
        return busboy;
    }

    #handleFileBytes(filename) {
        async function* handleData(data) {
            for await (const item of data) {
                const size = item.length;
                this.#io.to(this.#socketId).emit(ON_UPLOAD_EVENT, size);
                yield item;
            }
        }
        return handleData.bind(this);
    }

    async #onFile(fieldname, file, filename) {
        const saveFileTo = join(__dirname, "../", "downloads", filename);
        logger.info(`Uploading ${saveFileTo}`);
        await pipeline(
            file,
            this.#handleFileBytes.apply(this, [filename]),
            createWriteStream(saveFileTo),
        );
        logger.info(`File [${filename}] finished`);
    }
}
