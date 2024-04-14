import http from "node:http";
import { Server } from "socket.io";

import { constants } from "./constants.js";

export default class SocketServer {
  #io;

  constructor({ port }) {
    this.port = port;
    this.namespaces = {};
  }

  attachEvents({ routeConfig }) {
    for (const route of routeConfig) {
      for (const [namespace, { events, eventEmitter }] of Object.entries(
        route
      )) {
        const route = (this.namespaces[namespace] = this.#io.of(
          `/${namespace}`
        ));
        route.on("connection", (socket) => {
          for (const [functionName, functionValue] of events) {
            socket.on(functionName, (...args) =>
              functionValue(socket, ...args)
            );
          }
          eventEmitter.emit(constants.event.USER_CONNECTED, socket);
        });
      }
    }
  }

  async start() {
    const server = http.createServer((request, response) => {
      response.writeHead(200, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "options,post,get",
      });
      response.end("hey there!!!");
    });
    this.#io = new Server(server, {
      cors: {
        origin: "*",
        credentials: false,
      },
    });
    return new Promise((resolve, reject) => {
      server.on("error", reject);
      server.listen(this.port, () => resolve(server));
    });
  }
}
