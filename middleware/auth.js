const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET =
  process.env.JWT_SECRET || "mural-da-turma-jwt-secret-2026";

async function autenticar(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const partes = header.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Token não informado."
      });
    }

    const payload = jwt.verify(partes[1], JWT_SECRET);

    const usuario = await User.findById(payload.id).select("+senha");

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Usuário não encontrado ou desativado."
      });
    }

    req.usuario = usuario;
    next();
  } catch (erro) {
    return res.status(401).json({
      sucesso: false,
      mensagem: "Token inválido ou expirado."
    });
  }
}

module.exports = autenticar;