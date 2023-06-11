const server = require("http").createServer((request, response) => {
  response.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  });
});

const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
    origin: "*",
    credential: false,
  },
});
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.info(`User: ${userId} join room: ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

const startServer = () => {
  const { address, port } = server.address();
  console.info(`app running at ${address}:${port}`);
};

server.listen(3000, startServer);
