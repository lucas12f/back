const express = require("express");
const router = express.Router();

const {
  cadastrar,
  login,
  perfil,
  listar,
  editar,
  desativar,
  esqueciSenha,
  redefinirSenha
} = require("../controllers/userController");

const autenticar = require("../middleware/auth");

router.post("/cadastrar", cadastrar);
router.post("/login", login);

router.get("/", autenticar, listar);

router.post("/esqueci-senha", esqueciSenha);
router.post("/redefinir-senha", redefinirSenha);

router.get("/perfil", autenticar, perfil);
router.put("/editar", autenticar, editar);
router.delete("/desativar", autenticar, desativar);

module.exports = router;