// {}の必要性がよくわからない。名前つきimport({}がついてる)とデフォルトのimportの違い?
import { currentServer } from "http";
import { Server } from "socket.io";
import express from "express";

//定数を入れ子構造にしてる、app->http->io
const app = express();
const http = currentServer(app);
const io = new Server(http);

// ディレクトリを指定
app.use(express.static("public"));

// これ何してるかわからない。
// io.onとは？ 
io.on("connection", (socket) => 
    // onAny = 何でも？
    // emit = 排出
    // そもそも => がわからん。
    socket.onAny((event, data) => socket.broadcast.emit(event, data)),
);

http.listen(Number(process.env.PORT) || 3000);
