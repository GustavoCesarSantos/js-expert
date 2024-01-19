import url from "node:url";
import { pipeline } from "node:stream/promises";

import { UploadHandler } from "./uploadHandler.js";

export class Routes {
    #io;

    constructor(io) {
        this.#io = io;
    }

    async options(request, response) {
        response.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST",
        });
        response.end();
    }

    async post(request, response) {
        const { headers } = request;
        const {
            query: { socketId },
        } = url.parse(request.url, true);
        const redirectTo = headers.origin;
        const uploadHandler = new UploadHandler(this.#io, socketId);
        const onFinish = (response, redirectTo) => () => {
            response.writeHead(303, {
                Connection: "close",
                Location: `${redirectTo}?msg=Files uploaded with success`,
            });
            response.end();
        };
        const busboyInstance = uploadHandler.registerEvents(
            headers,
            onFinish(response, redirectTo),
        );
        await pipeline(request, busboyInstance);
        logger.info("Request finished with success");
    }
}
