import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//create server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

//handle connection
wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    ws.on("message", (message) => { // Removed explicit 'string' type annotation to accept RawData
        const messageString = message.toString();
        console.log("Message from client: ", messageString);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

//start server
server.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
});
