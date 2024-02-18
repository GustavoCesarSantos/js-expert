import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import { Server } from "socket.io";

import { logger } from "./utils/pinoLogger.js";
import { Routes } from "./routes.js";

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
process.env.USER = process.env.USER ?? "system_user";
const localHostSSL = {
  key: fs.readFileSync("./certificates/key.pem"),
  cert: fs.readFileSync("./certificates/cert.pem"),
};
const protocol = isProduction ? http : https;
const sslConfig = isProduction ? {} : localHostSSL;
const routes = new Routes();
const httpServer = protocol.createServer(sslConfig, routes.handle.bind(routes));
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: false,
  },
});
io.on("connection", (socket) =>
  logger.info(`connected to socket: ${socket.id}`)
);
const startServer = () => {
  const { address, port } = httpServer.address();
  const protocol = isProduction ? "http" : "https";
  logger.info(`app running at ${protocol}://${address}:${port}`);
};
httpServer.listen(PORT, startServer);
