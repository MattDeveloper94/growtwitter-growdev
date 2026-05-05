import request from "supertest";
import app from "../app";
import { prisma, pool } from "../database/prismadb";

describe("Fluxo completo, criacao de usuario, login com email, criacao de tweet com validacao do usuario com token", () => {
  it("criar usuario, fazer login com email e criar tweet", async () => {
    // *******************************************************************************************************
    const timestamp = Date.now();
    const usuarioTeste = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    // criar usuario
    const criarUsuario = await request(app)
      .post("/api/users")
      .send(usuarioTeste);

    expect(criarUsuario.status).toBe(201);

    // fazer login com email
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        login: usuarioTeste.email, //email
        senha: usuarioTeste.senha
      });

    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty("token");

    const token = login.body.token;

    // criar tweet
    const tweet = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: `foi com email!`
      });
    console.log("TWEET:", tweet.status, tweet.body);
    expect(tweet.status).toBe(201);
  });
});

// *******************************************************************************************************
// *******************************************************************************************************

describe("Fluxo completo, criacao de usuario, login com username, criacao de tweet com validacao do usuario com token", () => {
  it("criar usuario, fazer login com username e criar tweet", async () => {
    // *******************************************************************************************************
    const timestamp = Date.now();
    const usuarioTeste = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2010-10-10"
    };

    // criar usuario
    const criarUsuario = await request(app)
      .post("/api/users")
      .send(usuarioTeste);

    expect(criarUsuario.status).toBe(201);

    // fazer login com email
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        login: usuarioTeste.username, //username 
        senha: usuarioTeste.senha
      });

    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty("token");

    const token = login.body.token;

    // criar tweet
    const tweet = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: `foi com username!`
      });

    expect(tweet.status).toBe(201);
  });
});

// *******************************************************************************************************
// *******************************************************************************************************

describe("Autenticacao de usuario", () => {
  const timestamp = Date.now();
  const usuarioTeste = {
    nome: `Teste${timestamp}`,
    username: `teste_${timestamp}`,
    email: `teste_${timestamp}@email.com`,
    senha: "123456",
    dtNascimento: "2000-01-01"
  };

  it("deve criar usuario, login: email ou username correto | senha: 'senha errada'", async () => {
    // *******************************************************************************************************
    // criar usuario
    const criarUsuario = await request(app)
      .post("/api/users")
      .send(usuarioTeste);

    expect(criarUsuario.status).toBe(201);


    //login com senha errada → email
    const loginEmail = await request(app)
      .post("/api/auth/login")
      .send({
        login: usuarioTeste.email,
        senha: "errada"
      });

    expect(loginEmail.status).toBe(400);


     //login com senha errada → username
    const loginUsername = await request(app)
      .post("/api/auth/login")
      .send({
        login: usuarioTeste.username,
        senha: "errada"
      });

    expect(loginUsername.status).toBe(400);


    // tenta criar um tweet sem token válido
    const response = await request(app)
      .post("/api/tweets")
      .send({
        conteudo: `Datenow() é: ${timestamp}`
      });

    expect(response.status).toBe(401);


    // fazendo login do usuario com dados válidos
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        login: usuarioTeste.email,
        senha: usuarioTeste.senha
      });

    expect(loginResponse.status).toBe(200);

    // recebendo token do body
    const token = loginResponse.body.token;

    // tenta criar um tweet com token válido
    const tweetToken = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: "Tweetando com token válido!"
      });

    expect(tweetToken.status).toBe(201);
  });
});

// // *******************************************************************************************************
// // *******************************************************************************************************


afterAll(async () => {
  await prisma.$disconnect();
  await pool.end();
});