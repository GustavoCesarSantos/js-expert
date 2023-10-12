import { logger } from "./utils/pinoLogger.js";

export class Routes {
  io;

  constructor() {}

  setSocketInstance(io) {
    this.io = io;
  }

  async defaultRoute(request, response) {
    response.end("Hello World");
  }

  async options(request, response) {
    response.writeHead(204);
    response.end("Hello World");
  }

  async post(request, response) {
    logger.info("POST");
    response.end();
  }

  async get(request, response) {
    logger.info("GET");
    response.end();
  }

  handle(request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    const route = this[request.method.toLowerCase()] || this.defaultRoute;
    return route.apply(this, [request, response]);
  }
}
