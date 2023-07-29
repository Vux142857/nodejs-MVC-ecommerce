const server = require("../bin/www");
const { Server } = require("socket.io");
const io = new Server(server);
let listHome = [];
let listProduct = [];
let listArticle = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("collection", (msg) => {
    console.log(msg);
    switch (msg) {
      case "article":
        listArticle.push(socket.id);
        console.log(
          `Total connected users to article page: ${listArticle.length}`
        );
        break;
      case "product":
        listProduct.push(socket.id);
        console.log(
          `Total connected users to product page: ${listProduct.length}`
        );
        break;
    }
  });

  io.emit("userInArticle", { value: listArticle.length });
  io.emit("userInProduct", { value: listProduct.length });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    const socketIndex = listArticle.indexOf(socket.id);
    if (socketIndex !== -1) {
      listArticle.splice(socketIndex, 1);
      console.log(
        `Total connected users to article page: ${listArticle.length}`
      );
    }

    const productSocketIndex = listProduct.indexOf(socket.id);
    if (productSocketIndex !== -1) {
      listProduct.splice(productSocketIndex, 1);
      console.log(
        `Total connected users to product page: ${listProduct.length}`
      );
    }
  });
});
var productCount = listProduct.length;
var articleCount = listArticle.length;

// module.exports = {
//   productCount,
//   articleCount,
// };
