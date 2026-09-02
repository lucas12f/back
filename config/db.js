const mongoose = require("mongoose");

// ATENÇÃO:
// Esta URI foi colocada conforme a conexão informada para o seu MongoDB.
// NÃO publique este arquivo em repositório público.
// Se o projeto for público, troque a senha do usuário do MongoDB e use
// MONGODB_URI nas Environment Variables da Vercel.
const MONGODB_URI =
  "mongodb+srv://admin:admin@cluster0.z4p0psn.mongodb.net/?appName=Cluster0";

let conexao = null;

async function conectarBanco() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!conexao) {
    conexao = mongoose
      .connect(process.env.MONGODB_URI || MONGODB_URI, {
        dbName: process.env.MONGODB_DB || "mural_turma",
        serverSelectionTimeoutMS: 10000
      })
      .catch((erro) => {
        conexao = null;
        throw erro;
      });
  }

  await conexao;
  return mongoose.connection;
}

module.exports = conectarBanco;