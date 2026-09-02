const express = require("express");
const cors = require("cors");
const conectarBanco = require("./config/db");
const UserRouters = require("./routes/UserRouters");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: "API funcionando! 🚀",
    versao: "1.0.0"
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: "API funcionando! 🚀",
    versao: "1.0.0"
  });
});

app.use("/api/usuarios", async (req, res, next) => {
  try {
    await conectarBanco();
    next();
  } catch (erro) {
    console.error("ERRO MONGODB:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao conectar ao MongoDB."
    });
  }
});

app.use("/api/usuarios", UserRouters);

app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: "Rota não encontrada."
  });
});

module.exports = app;