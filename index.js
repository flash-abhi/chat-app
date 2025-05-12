import express from "express";
import path from "path"
import http from "http"
import { Server } from "socket.io";
const app = express();

const PORT = process.env.PORT || 4000

app.use(express.static(path.join('public')));

export const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

let socketConneted = new Set();
io.on("connection",onConnection)

server.listen(PORT,()=>{
    console.log("server is listening on Port ",PORT)
})

function onConnection(socket){
    console.log(socket.id);
    socketConneted.add(socket.id);

    io.emit("clients-total",socketConneted.size);

    socket.on("message",(data)=>{
        // console.log(data);
        socket.broadcast.emit("chat-message",data);
    });
    socket.on("feedback",(data)=>{
        socket.broadcast.emit("feedback",data)
    })
    socket.on("disconnect",()=>{
        // console.log("socket disconnected",socket.id);
        socketConneted.delete(socket.id);
        io.emit("clients-total",socketConneted.size);
    });
}

