# 🐦 GrowTwitter

Aplicação inspirada no Twitter desenvolvida durante o curso de Formação em Desenvolvimento Web Back-End com Node.js e C# (GrowDev).

---

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- API REST
- Programação Orientada a Objetos (POO)
- PostgreSQL
- Prisma ORM
- Docker
- JWT Authentication
- Testes automatizados com Jest e Supertest

---

## 🔐 Autenticação

A aplicação utiliza JWT (JSON Web Token) para autenticação e proteção de rotas.

---

### 🔑 Como funciona

1. O usuário realiza login pela rota de autenticação
2. O backend valida as credenciais
3. O backend gera um JWT contendo o ID do usuário
4. O token retornado deve ser utilizado nas rotas protegidas
5. O middleware valida o token e libera o acesso à rota

---

### 🔒 Header Authorization

```http
Authorization: Bearer TOKEN
```

---

## 🛡️ Segurança

### O backend identifica o usuário através do token
### Validação de permissão para:
-     editar tweets ✅ concluído
-     deletar tweets ✅ concluído
-     seguir/deixar de seguir usuários ✅ concluído
-     reply tweets ✅ concluído
-     curtidas de usuários ✅ concluído
-     proteção de rotas privadas ✅ concluído
-     validação de permissão de usuário ✅

---

## 💻 Funcionalidades

-     Cadastro de usuário ✅ concluído
-     Login e autenticação ✅ concluído
-     Criar tweet ✅ concluído
-     Atualizar tweet ✅ concluído
-     Deletar tweet ✅ concluído
-     Reply tweet ✅ concluído
-     Like tweet ✅ concluído
-     Follow/Unfollow ✅ concluído
-     Autenticação com JWT ✅ concluído
-     Sistema de Testes automatizados ✅ concluído
-     Docker ✅ concluído

---

### 🧪 Testes automatizados

O projeto possui testes utilizando Jest e Supertest.

Para rodar os testes:

```bash
npm test
```

### ✔️ Cobertura atual
- criação de usuário
- login com email e username
- autenticação JWT
- criação de tweets
- update de tweets
- delete de tweets
- validação de tweet vazio
- validação de tweet > 280 caracteres
- reply em tweets
- like / unlike
- follow / unfollow
- usuário seguindo a si mesmo
- atualização de tweet de outro usuário
- deleção de tweet de outro usuário

---

## 🚀 Rotas principais

  🔐 Autenticação
POST /api/auth/login

  👤 Usuários
POST /api/users

  📝 Tweets
POST   /api/tweets
PUT    /api/tweets/:id
DELETE /api/tweets/:id
GET    /api/tweets

  ❤️ Likes
POST /api/likes/:id

  🤝 Follow
POST /api/follows/:id
DELETE /api/follows/:id

---

# 📚 Documentação da API

A documentação da API foi criada utilizando Swagger.

Após iniciar o projeto, acesse:

## Ambiente local

```bash
http://localhost:3000/api-docs
```

## Produção (Render)

```bash
https://growtwitter-growdev.onrender.com
```

A documentação permite visualizar todas as rotas da API, incluindo:

- Autenticação
- Usuários
- Tweets
- Likes
- Follows

---

## ⚙️ Como rodar o projeto

### 🔑 Pré-requisitos

* Node.js instalado
* Docker instalado
* Banco PostgreSQL (ex: Neon)

---

### 🔑 Configuração do ambiente

Crie um arquivo `.env` baseado no `.env.example`:

**Linux/Mac:**

```bash
cp .env.example .env
```

**Windows:**

* copie o arquivo `.env.example`
* renomeie para `.env`

Depois preencha:

```env
DATABASE_URL="sua_url_do_postgresql"
JWT_SECRET="seu_segredo"
PORT=3000
```

---

### 🗄️ Configurar o banco de dados

Execute as migrations para criar as tabelas no banco:

```bash
npx prisma migrate dev
```

---

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

### 🧪 Testando a API

Utilize o Postman ou outra ferramenta para testar as rotas.

## 🔐 Login

POST /api/auth/login

Após o login, copie o token JWT retornado.

## 🔒 Rotas protegidas

Envie o token no header:

Authorization: Bearer TOKEN

---

### 📁 Estrutura do projeto

```txt
src/
├── database
├── middlewares
├── modules
│   ├── controllers
│   ├── dtos
│   ├── repositories
│   ├── routes
│   └── services
└── tests
```

📌 Status do projeto

🚧 Projeto em evolução contínua para estudos de backend, testes automatizados, autenticação e arquitetura de APIs REST.
