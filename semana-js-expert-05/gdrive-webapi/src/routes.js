import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { FileHelper } from "./utils/fileHelper.js";
import { logger } from "./utils/pinoLogger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultFolder = resolve(__dirname, "../", "downloads");
export class Routes {
    io;

    constructor(folder = defaultFolder) {
        this.folder = folder;
        this.fileHelper = FileHelper;
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
        logger.info("POST");
        response.end();
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
