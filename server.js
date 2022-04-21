const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// increase the limit
myEmitter.setMaxListeners(20);

users = [];

io.on("connection", function (socket) {
  users.push(socket.id);
  console.log("A user connected");
  console.log(users.length + " client(s) connected!");
  io.sockets.emit("broadcast", {
    description: users.length + " clients connected!",
  });

  socket.on("disconnect", () => {
    users.pop(socket.id);
    console.log("user disconnected");
    console.log("now only" + users.length + " client(s) connected!");

    io.sockets.emit("broadcast", {
      description: "now only" + users.length + " clients connected!",
    });
  });

  socket.on("setUsername", function (data) {
    console.log(data);
    if (users.indexOf(data) > -1) {
      socket.emit(
        "userExists",
        data + " username is taken! Try some other username."
      );
    } else {
      // users.push(data);
      socket.emit("userSet", { username: data });
    }
  });

  socket.on("msg", function (data) {
    //Send message to everyone
    io.sockets.emit("newmsg", data);
  });
});
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
