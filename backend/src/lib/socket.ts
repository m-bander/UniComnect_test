import http, { IncomingMessage, ServerResponse } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

export const initializeWebSocketServer = (
  httpServer: http.Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  io = require("socket.io")(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io is not initialized");

  return io;
};
