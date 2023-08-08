const server = require("../bin/www");
const { Server } = require("socket.io");
const fs = require("fs");
const appRoot = require("app-root-path");

const io = new Server(server);

const filePath = appRoot + "/app/file.txt";

let clientsByCollection = {
  total: [],
  article: [],
  product: [],
};

io.on("connection", (socket) => {
  console.log("A user connected");
  clientsByCollection = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  clientsByCollection.total.push(socket.id);
  socket.on("collection", (msg) => {
    console.log(`Total connected users: ${clientsByCollection.total.length}`);
    if (msg === "article" || msg === "product") {
      clientsByCollection[msg].push(socket.id);
      console.log(
        `Total connected users to ${msg} page: ${clientsByCollection[msg].length}`
      );
      fs.writeFileSync(filePath, JSON.stringify(clientsByCollection));
      io.emit("userInArticle", { value: clientsByCollection.article.length });
      io.emit("userInProduct", { value: clientsByCollection.product.length });
      io.emit("totalVistor", {
        value: clientsByCollection.total.length,
      });
    }
  });

  socket.on("sendMessage", (msg) => {
    io.emit("rececivedMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");

    for (const collection in clientsByCollection) {
      const socketIndex = clientsByCollection[collection].indexOf(socket.id);
      if (socketIndex !== -1) {
        clientsByCollection[collection].splice(socketIndex, 1);
        console.log(
          `Total connected users to ${collection} page: ${clientsByCollection[collection].length}`
        );
        fs.writeFileSync(filePath, JSON.stringify(clientsByCollection));
        io.emit("userInArticle", { value: clientsByCollection.article.length });
        io.emit("userInProduct", { value: clientsByCollection.product.length });
        io.emit("totalVistor", {
          value: clientsByCollection.total.length,
        });
      }
    }
  });
});
