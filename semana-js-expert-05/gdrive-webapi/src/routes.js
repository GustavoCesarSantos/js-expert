import { dirname, resolve } from "node:path";
import { fileURLToPath, parse } from "node:url";

import { FileHelper } from "./utils/fileHelper.js";
import { logger } from "./utils/pinoLogger.js";
import UploadHandler from "./utils/uploadHandler.js";
import { pipeline } from "node:stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultFolder = resolve(__dirname, "../", "downloads");
export class Routes {
  constructor(folder = defaultFolder) {
    this.folder = folder;
    this.fileHelper = FileHelper;
    this.io = {};
  }

  setSocketInstance(io) {
    this.io = io;
  }

  async defaultRoute(request, response) {
    response.end("Hello World");
  }

  async options(request, response) {
    response.writeHead(204);
    response.end();
  }

  async post(request, response) {
    const { headers } = request;
    const {
      query: { socketId },
    } = parse(request.url, true);
    const uploadHandler = new UploadHandler({
      socketId,
      io: this.io,
      downloadsFolder: this.folder,
    });
    const onFinish = (response) => {
      response.writeHead(200);
      const data = JSON.stringify({ result: "Files uploaded with success!" });
      response.end(data);
    };

    const busboyInstance = uploadHandler.registerEvents(
      headers,
      onFinish(response)
    );
    await pipeline(request, busboyInstance);
    logger.info("Request finished");
  }

  async get(request, response) {
    const files = await this.fileHelper.getFilesStatus(this.folder);
    response.writeHead(200);
    response.end(JSON.stringify(files));
  }

  handle(request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    const route = this[request.method.toLowerCase()] || this.defaultRoute;
    return route.apply(this, [request, response]);
  }
}
