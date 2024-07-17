//Importação
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

//Cria uma aplicação Express
const app = express();

//Cria um servidor HTTP usando o Express
const server = http.createServer(app);

//Cria a instância do Socket
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Endereço cliente React
    methods: ["GET", "POST"], //Métodos
  },
});

// CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Substitua pelo endereço do seu cliente React
  })
);

// Express para reconhecer arquivos estáticos
app.use(express.static(path.join(__dirname, "../client/build")));

//Conexões
io.on("connection", (socket) => {
  console.log("Usuário conectado");

  //Desconexão
  socket.on("disconnect", () => {
    console.log("Usuário desconectado");
  });

  //Lida com a mensagem recebida
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", msg);
  });
});

//Porta do servidor
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});

//Respota no HTML
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
