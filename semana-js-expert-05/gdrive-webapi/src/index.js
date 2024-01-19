import https from "node:https";
import fs from "node:fs";
import { Server } from "socket.io";

import { logger } from "./utils/pinoLogger.js";
import { Routes } from "./routes.js";

const PORT = process.env.PORT || 3000;
const localHostSSL = {
  key: fs.readFileSync("./certificates/key.pem"),
  cert: fs.readFileSync("./certificates/cert.pem"),
};
const routes = new Routes();
const httpServer = https.createServer(localHostSSL, routes.handle.bind(routes));
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: false,
  },
});
io.on("connection", (socket) =>
  logger.info(`connected to socket: ${socket.id}`),
);
const startServer = () => {
  const { address, port } = httpServer.address();
  logger.info(`app running at https://${address}:${port}`);
};
httpServer.listen(PORT, startServer);
