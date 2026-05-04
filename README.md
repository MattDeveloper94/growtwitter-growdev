# 🐦 GrowTwitter

Aplicação inspirada no Twitter desenvolvida durante o curso de Formação em Desenvolvimento Web Back-End com Node.js e C# (GrowDev).

---

## 🚀 Tecnologias

-     Node.js
-     TypeScript
-     Express
-     API REST
-     Programação Orientada a Objetos (POO)
-     PostgreSQL
-     Prisma ORM
-     Docker
-     JWT Authentication

---

## 🔐 Autenticação

A aplicação utiliza JWT (JSON Web Token) para autenticação e proteção de rotas.

🔑 Como funciona
-     1. O usuário realiza login pela rota de autenticação.
-     2. O backend valida as credenciais.
-     3. O backend gera um JWT contendo o id do usuário.
-     4. O token retornado deve ser copiado no Postman.
-     5. Nas rotas protegidas, o token deve ser enviado no header: Authorization: Bearer TOKEN
-     6. O middleware valida o token e libera o acesso à rota.

---

## 🛡️ Segurança

- O backend identifica o usuário através do token
- Validação de permissão para:
-     editar tweets ✅ concluído
-     deletar tweets ✅ concluído
-     seguir/deixar de seguir usuários ✅ concluído
-     reply tweets ✅ concluído
-     comentar tweets ⏳ em desenvolvimento
-     curtidas de usuários ✅ concluído

---

## 💻 Funcionalidades

-     Cadastro de usuário ✅ concluído
-     Login e autenticação ✅ concluído
-     Criar tweet ✅ concluído
-     Atualizar tweet ✅ concluído
-     Deletar tweet ✅ concluído
-     Reply tweet ✅ concluído
-     Comentar tweet ⏳ em desenvolvimento
-     Like tweet ✅ concluído
-     Follow/Unfollow ✅ concluído
-     Autenticação com JWT ✅ concluído
-     Sistema de Teste ⏳ em desenvolvimento
-     Docker ✅ concluído

---

## 🚀 Rotas principais

  🔐 Autenticação
POST /auth/login

  👤 Usuários
POST /users

  📝 Tweets
POST   /tweets
PUT    /tweets/:id
DELETE /tweets/:id
GET    /tweets

  ❤️ Likes
POST /likes/:id

  🤝 Follow
POST /follows/:id

---

## ⚙️ Como rodar o projeto

### 💻 Rodando localmente

```bash
# clonar repositório
git clone https://github.com/MattDeveloper94/growtwitter_growdev.git

# entrar na pasta
cd growtwitter_backend

# instalar dependências
npm install

# rodar servidor
npm run dev
```

A API estará disponível em:

http://localhost:3000

---

### 🐳 Rodando com Docker

```bash
# subir container
docker compose up --build
```

A API estará disponível em:

http://localhost:3000

---

### 🛑 Parar o Docker

```bash
docker compose down
```

---

### 🔑 Variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

**Linux/Mac:**

```bash
cp .env.example .env
```

**Windows:**

* copie o arquivo `.env.example`
* renomeie para `.env`
