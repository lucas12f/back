const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET =
  process.env.JWT_SECRET || "mural-da-turma-jwt-secret-2026";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function usuarioResposta(usuario) {
  return {
    id: usuario._id,
    nome: usuario.nome,
    email: usuario.email,
    ativo: usuario.ativo
  };
}

function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario._id.toString(),
      email: usuario.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body || {};

    if (!nome || !email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nome, e-mail e senha são obrigatórios."
      });
    }

    if (String(senha).length < 6) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "A senha deve ter pelo menos 6 caracteres."
      });
    }

    const emailNormalizado = String(email).trim().toLowerCase();

    let usuario = await User.findOne({ email: emailNormalizado }).select("+senha");

    if (usuario && usuario.ativo) {
      return res.status(409).json({
        sucesso: false,
        mensagem: "Este e-mail já está cadastrado."
      });
    }

    if (usuario && !usuario.ativo) {
      usuario.nome = String(nome).trim();
      usuario.senha = senha;
      usuario.ativo = true;
      await usuario.save();
    } else {
      usuario = await User.create({
        nome: String(nome).trim(),
        email: emailNormalizado,
        senha,
        ativo: true
      });
    }

    const token = gerarToken(usuario);

    return res.status(201).json({
      sucesso: true,
      mensagem: "Usuário cadastrado com sucesso!",
      token,
      usuario: usuarioResposta(usuario)
    });
  } catch (erro) {
    console.error("ERRO CADASTRAR:", erro);

    if (erro.code === 11000) {
      return res.status(409).json({
        sucesso: false,
        mensagem: "Este e-mail já está cadastrado."
      });
    }

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar usuário."
    });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "E-mail e senha são obrigatórios."
      });
    }

    const usuario = await User.findOne({
      email: String(email).trim().toLowerCase()
    }).select("+senha");

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "E-mail ou senha inválidos."
      });
    }

    const correta = await usuario.senhaCorreta(senha);

    if (!correta) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "E-mail ou senha inválidos."
      });
    }

    const token = gerarToken(usuario);

    return res.status(200).json({
      sucesso: true,
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: usuarioResposta(usuario)
    });
  } catch (erro) {
    console.error("ERRO LOGIN:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao fazer login."
    });
  }
}

async function perfil(req, res) {
  return res.status(200).json({
    sucesso: true,
    usuario: usuarioResposta(req.usuario)
  });
}

async function listar(req, res) {
  try {
    const usuarios = await User.find({ ativo: true })
      .select("nome email ativo createdAt updatedAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      sucesso: true,
      total: usuarios.length,
      usuarios
    });
  } catch (erro) {
    console.error("ERRO LISTAR:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar usuários."
    });
  }
}

async function editar(req, res) {
  try {
    const { nome, email, senha } = req.body || {};
    const usuario = req.usuario;

    if (nome !== undefined) usuario.nome = String(nome).trim();

    if (email !== undefined) {
      usuario.email = String(email).trim().toLowerCase();
    }

    if (senha !== undefined) {
      if (String(senha).length < 6) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "A senha deve ter pelo menos 6 caracteres."
        });
      }
      usuario.senha = senha;
    }

    await usuario.save();

    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuário atualizado com sucesso!",
      usuario: usuarioResposta(usuario)
    });
  } catch (erro) {
    console.error("ERRO EDITAR:", erro);

    if (erro.code === 11000) {
      return res.status(409).json({
        sucesso: false,
        mensagem: "Este e-mail já está cadastrado."
      });
    }

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao editar usuário."
    });
  }
}

async function desativar(req, res) {
  try {
    req.usuario.ativo = false;
    await req.usuario.save();

    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuário excluído com sucesso!"
    });
  } catch (erro) {
    console.error("ERRO DESATIVAR:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao excluir usuário."
    });
  }
}

async function esqueciSenha(req, res) {
  return res.status(501).json({
    sucesso: false,
    mensagem: "Recuperação de senha não configurada neste backend."
  });
}

async function redefinirSenha(req, res) {
  return res.status(501).json({
    sucesso: false,
    mensagem: "Redefinição de senha não configurada neste backend."
  });
}

module.exports = {
  cadastrar,
  login,
  perfil,
  listar,
  editar,
  desativar,
  esqueciSenha,
  redefinirSenha
};