import http from 'http';
import { Server } from 'socket.io';

import { Routes } from './routes.js';
import { logger } from './util.js';

const PORT = 3000;
const handler = function(request, response) {
    const defaultRoute = async (request, response) => response.end('Hello World');
    const routes = new Routes(io);
    const chosen = routes[request.method.toLowerCase()] || defaultRoute;
    return chosen.apply(routes, [request, response]);
}
const server = http.createServer(handler);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: false
    }
});
io.on("connection", (socket) => logger.info('someone connected', socket.id));
//const interval = setInterval(() => {
  //  io.emit('file-uploaded', 5e6);
//}, 250);
server.listen(PORT, () => {
    const { address, port } = server.address();
    logger.info(`Server running at http://${address}:${port}`);
});

