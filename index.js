import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const http = createServer(app);
const io = new Server(http);

// 静的ファイルを配置するディレクトリを指定
app.use(express.static("public"));

/**
 * remoteIdを格納する配列
 */
let remoteIdArray = [];

/**
 * remoteIdとクライアントIDをオブジェクトとして格納
 */
let remoteIdAndClientId = [];

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    /**
     * roomIdを配列に入っているかどうか確認
     */
    let isInclude = remoteIdArray.includes(data);
    console.log(`isInclude: ${isInclude}`);
    console.log(`remoteIdArray: ${remoteIdArray}`);
    // 配列に入っている場合は削除しレディーイベントを送信
    if (isInclude) {
      remoteIdArray = remoteIdArray.filter((id) => id !== data);
      /**
       * remoteIdとクライアントIDをオブジェクトとして格納している配列から
       * クライアントIDを取得
       */
      const clientId = remoteIdAndClientId.find(
        (obj) => obj.remoteId === data
      ).clientId;

      /**
       * remoteIdとクライアントIDをオブジェクトとして格納している配列から
       * 削除
       */
      remoteIdAndClientId = remoteIdAndClientId.filter(
        (obj) => obj.remoteId !== data
      );

      io.to(clientId).emit("ready");
      io.to(socket.id).emit("ready");
    } else {
      remoteIdArray.push(data);
      remoteIdAndClientId.push({ remoteId: data, clientId: socket.id });
      io.emit("please_wait");
    }
  });

  socket.onAny((event, data) => {
    if (event !== "join") {
      socket.broadcast.emit(event, data);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

http.listen(Number(process.env.PORT) || 3000, () => {
  console.log(
    `Server is running on http://localhost:${Number(process.env.PORT) || 3000}`
  );
});
