import request from "supertest";
import app from "../app";
import { prisma, pool } from "../database/prismadb";

function expectCreateUser(createUser: any, userTest: any) {
  expect(createUser.status).toBe(201); // status 201
  expect(createUser.body.ok).toBe(true); //ok === true

  expect(createUser.body.usuario).toHaveProperty("id"); //usuario deve conter a prop. id
  expect(createUser.body.usuario.id).toBeDefined(); // !undefined
  expect(typeof createUser.body.usuario.id).toBe("string"); //id type string

  expect(createUser.body.usuario.nome).toBe(userTest.nome); //check nome req/res
  expect(createUser.body.usuario.username).toBe(userTest.username); //check username req/res
  expect(createUser.body.usuario.email).toBe(userTest.email); //check email req/res

  expect(createUser.body.usuario).not.toHaveProperty("senha"); //!senha → nao pode retorna senha no body
}

function expectLogin(login: any, userTest: any) {
  expect(login.status).toBe(200); // status 200
  expect(login.body.ok).toBe(true); //ok === true

  expect(login.body).toHaveProperty("usuario"); //login deve conter prop. usuario
  expect(login.body).toHaveProperty("token"); //login deve conter prop. token

  expect(login.body.usuario.username).toBe(userTest.username); //check username req/res
  expect(login.body.usuario.email).toBe(userTest.email); //check email req/res

  expect(typeof login.body.usuario.email).toBe("string"); //type string
  expect(typeof login.body.usuario.username).toBe("string"); //type string
  expect(typeof login.body.token).toBe("string"); //type string

  expect(login.body.usuario).toBeDefined(); //!undefined
  expect(login.body.token).toBeDefined(); //!undefined

  expect(login.body.usuario).not.toHaveProperty("senha"); //!senha → nao pode retorna senha no body
}

function expectCreateTweet(tweet: any) {
  expect(tweet.status).toBe(201); // status 201
  expect(tweet.body.ok).toBe(true); //ok === true

  expect(tweet.body.tweet).toHaveProperty("usuarioId"); // deve conter a prop. usuarioId
  expect(tweet.body.tweet).toHaveProperty("tweetId"); // deve conter a prop. tweetId
  expect(tweet.body.tweet).toHaveProperty("conteudo"); // deve conter a prop. conteudo
  expect(tweet.body.tweet).toHaveProperty("replyId"); // deve conter a prop. replyId
  expect(tweet.body.tweet).toHaveProperty("replyTo"); // deve conter a prop. replyTo

  expect(typeof tweet.body.tweet.tweetId).toBe("string"); // type string
  expect(typeof tweet.body.tweet.conteudo).toBe("string"); // type string
  expect(typeof tweet.body.tweet.usuarioId).toBe("string"); // type string

  expect(tweet.body.tweet.replyId).toBeNull(); // type null → tweet novo sem apontamento
  expect(tweet.body.tweet.replyTo).toBeNull(); // type null → tweet novo sem relacao
}

function expectUpdateTweet(tweetUpdate: any) {
  expect(tweetUpdate.status).toBe(200);
  expect(tweetUpdate.body.ok).toBe(true);

  expect(tweetUpdate.body.tweetAtualizado).toHaveProperty("tweetId");
  expect(tweetUpdate.body.tweetAtualizado).toHaveProperty("conteudo");

  expect(typeof tweetUpdate.body.tweetAtualizado.tweetId).toBe("string");
  expect(typeof tweetUpdate.body.tweetAtualizado.conteudo).toBe("string");

  expect(tweetUpdate.body.tweetAtualizado).not.toHaveProperty("replyTo");
  expect(tweetUpdate.body.tweetAtualizado).not.toHaveProperty("replyId");
}

function expectError400(response: any) {
  expect(response.status).toBe(400);
  expect(response.body.ok).toBe(false);
  expect(response.body).toHaveProperty("message");
  expect(typeof response.body.message).toBe("string");
}

function expectError401(response: any) {
  expect(response.status).toBe(401);
  expect(response.body.ok).toBe(false);
  expect(response.body).toHaveProperty("message");
  expect(typeof response.body.message).toBe("string");
}

describe("Fluxo completo, criacao de usuario, login com email, criacao de tweet com validacao do usuario com token", () => {
  it("criar usuario, fazer login com email e criar tweet", async () => {
    // *******************************************************************************************************
    const timestamp = Date.now();
    const userTest = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    // criar usuario
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    // validando criacao de usuario
    expectCreateUser(createUser, userTest);

    // fazer login com email
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.email, //email
        senha: userTest.senha
      });

    //validando login
    expectLogin(login, userTest);

    // recebendo token
    const token = login.body.token;

    // criar tweet
    const tweet = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: `foi com email!`
      });

    //validando tweet criado
    expectCreateTweet(tweet);
  });
});

// *******************************************************************************************************
// *******************************************************************************************************

describe("Fluxo completo, criacao de usuario, login com username, criacao de tweet com validacao do usuario com token", () => {
  it("criar usuario, fazer login com username e criar tweet", async () => {
    // *******************************************************************************************************
    const timestamp = Date.now();
    const userTest = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2010-10-10"
    };

    // criar usuario
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    expectCreateUser(createUser, userTest);

    // fazer login com email
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.username, //username 
        senha: userTest.senha
      });

    expectLogin(login, userTest);

    //recebendo token
    const token = login.body.token;

    // criar tweet
    const tweet = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: `foi com username!`
      });

    expectCreateTweet(tweet);

    // alterar tweet
    const tweetId = tweet.body.tweet.tweetId;

    const tweetUpdate = await request(app)
      .put(`/api/tweets/${tweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: `NOVO TWEET! FOI ALTERADO!`
      });

    expectUpdateTweet(tweetUpdate);

  });
});

// *******************************************************************************************************
// *******************************************************************************************************

describe("Autenticacao de usuario", () => {
  const timestamp = Date.now();
  const userTest = {
    nome: `Teste${timestamp}`,
    username: `teste${timestamp}`,
    email: `teste_${timestamp}@email.com`,
    senha: "123456",
    dtNascimento: "2000-01-01"
  };

  it("deve criar usuario, login: email ou username correto | senha: 'senha errada'", async () => {
    // *******************************************************************************************************
    // criar usuario
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    expectCreateUser(createUser, userTest);

    //login com senha errada → email
    const loginEmail = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.email,
        senha: "errada"
      });

    expectError400(loginEmail);

    //login com senha errada → username
    const loginUsername = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.username,
        senha: "errada"
      });

    expectError400(loginUsername);

    // tenta criar um tweet sem token válido
    const tweetSemToken = await request(app)
      .post("/api/tweets")
      .send({
        conteudo: `Datenow() é: ${timestamp}`
      });

    expectError401(tweetSemToken);

    // fazendo login do usuario com dados válidos
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.email,
        senha: userTest.senha
      });

    expectLogin(loginResponse, userTest);

    // recebendo token do body
    const token = loginResponse.body.token;

    // tenta criar um tweet com token válido
    const tweetToken = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: "Tweetando com token válido!"
      });

    expectCreateTweet(tweetToken);
  });
});

// // *******************************************************************************************************
// // *******************************************************************************************************

describe("Autenticacao de Tweets", () => {
  it("cria usuario teste, faz login, recebe token valido e deve rejeitar um tweet vazio", async () => {
    const timestamp = Date.now();
    const userTest = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    // criar usuario
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    expectCreateUser(createUser, userTest);

    //login
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.email,
        senha: userTest.senha
      });

    expectLogin(login, userTest);

    //token válido recebido
    const token = login.body.token;

    const tweetEmpty = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: ""
      });

    expectError400(tweetEmpty);
  });

  it("criar usuario, fazer login, gerar token valido, validar tweets maior que 280 caracteres", async () => {
    const timestamp = Date.now();
    const userTest = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    // criar usuario
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    expectCreateUser(createUser, userTest);

    //login
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.email,
        senha: userTest.senha
      });

    expectLogin(login, userTest);

    //token válido recebido
    const token = login.body.token;

    // tweetando com 281 caracteres
    const tweetContentTooLong = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: "a".repeat(281)
      });

    expectError400(tweetContentTooLong);
  });
});
// // *******************************************************************************************************
// // *******************************************************************************************************

afterAll(async () => {
  await prisma.$disconnect();
  await pool.end();
});