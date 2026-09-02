# BACK - Mural da Turma

Backend Express + MongoDB/Mongoose para o frontend do Mural da Turma.

## Rotas

- GET `/`
- GET `/api`
- POST `/api/usuarios/cadastrar`
- POST `/api/usuarios/login`
- GET `/api/usuarios/` (Bearer token)
- GET `/api/usuarios/perfil` (Bearer token)
- PUT `/api/usuarios/editar` (Bearer token)
- DELETE `/api/usuarios/desativar` (Bearer token)

## MongoDB

A configuração já possui a URI informada no arquivo `config/db.js`.

Para um projeto público, NÃO deixe credenciais no GitHub. O ideal é:
- `MONGODB_URI`
- `MONGODB_DB=mural_turma`
- `JWT_SECRET`

na Vercel.

## Resposta da API

GET `/api` retorna:

{
  "sucesso": true,
  "mensagem": "API funcionando! 🚀",
  "versao": "1.0.0"
}
