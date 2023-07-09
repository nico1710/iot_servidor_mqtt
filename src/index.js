import mqtt from "mqtt";
import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const SERVER_PORT = 3000;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const client = mqtt.connect("mqtt://iot.ceisufro.cl:1883", {
  clientId: "33a91050-15d1-11ee-b199-3d650e5455ce",
  username: "QPSTgm5N9d4FrW35R12G",
  protocol: "mqtt",
});

io.on("connection", (socket) => {
  console.log("a user connected");

  client.on("connect", function () {
    console.log("connected");

    client.subscribe("v1/devices/me/attributes");
    client.publish(
      "v1/devices/me/attributes/request/1",
      JSON.stringify({
        clientKeys: "value,active,sensibility",
      })
    );
  });

  client.on("message", (receivedTopic, message) => {
    console.log(receivedTopic);
    console.log("Mensaje recibido:", message.toString());

    socket.emit("message", message.toString());
  });

  client.on("error", function (error) {
    console.log(error);
  });

  // cuando se desconecta un usuario
  socket.on("disconnect", () => {
    console.log(`[⚠DISCONNECT] User disconnected`);
  });
});

// listen
server.listen(SERVER_PORT, () => {
  console.log(`[🔋LISTEN]Server is running on port ${SERVER_PORT}`);
});
