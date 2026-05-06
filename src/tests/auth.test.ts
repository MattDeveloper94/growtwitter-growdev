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

describe("Fluxo completo", () => {
  const timestamp = Date.now();
  const userTest = {
    nome: `Teste${timestamp}`,
    username: `teste${timestamp}`,
    email: `teste${timestamp}@email.com`,
    senha: "123456",
    dtNascimento: "2000-01-01"
  };

  it("criando usuário teste", async () => {
    // criar usuário
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    // validando criacao de usuário
    expectCreateUser(createUser, userTest);
  });

  it("fluxo do usuário login → criar tweet → update e delete", async () => {
    // fazer login com email
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.username, //email
        senha: userTest.senha
      });

    //validando login
    expectLogin(login, userTest);

    const token = login.body.token;

    // criar tweet
    const tweet = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: `tweet com um token válido!`
      });

    //validando tweet criado
    expectCreateTweet(tweet);

    // update do tweet
    const tweetId = tweet.body.tweet.tweetId;

    const tweetUpdate = await request(app)
      .put(`/api/tweets/${tweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: `NOVO TWEET! FOI ALTERADO!`
      });

    expectUpdateTweet(tweetUpdate);

    //deletando tweet
    const tweetDelete = await request(app)
      .delete(`/api/tweets/${tweetId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(tweetDelete.status).toBe(204);

    // checando delete do tweet
    const getTweet = await request(app)
      .get(`/api/tweets/${tweetId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(getTweet.status).toBe(404);
  });
});

// *******************************************************************************************************
// *******************************************************************************************************

describe("Autenticação usuário", () => {
  const timestamp = Date.now();
  const userTest = {
    nome: `Teste${timestamp}`,
    username: `teste${timestamp}`,
    email: `teste_${timestamp}@email.com`,
    senha: "123456",
    dtNascimento: "2000-01-01"
  };

  it("usuário com nome inválido - vazio", async () => {
    const usuario = {
      nome: ``,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const nomeInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(nomeInvalido);
  });

  it("usuário com nome inválido - caracter especiais", async () => {
    const usuario = {
      nome: `m@theus`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const nomeInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(nomeInvalido);
  });

  it("usuário com username inválido - vazio", async () => {
    const usuario = {
      nome: `Teste${timestamp}`,
      username: ``,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const usernameInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(usernameInvalido);
  });

  it("usuário com username inválido - caracter especiais", async () => {
    const usuario = {
      nome: `Teste${timestamp}`,
      username: `m@theus`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const username = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(username);
  });

  it("usuário com username repetido", async () => {
    const userTest = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const usuario = await request(app)
      .post("/api/users")
      .send(userTest);

    const usernameRepetido = await request(app)
      .post("/api/users")
      .send(usuario.body);

    expectError400(usernameRepetido);
  });

  it("usuário com email inválido - vazio", async () => {
    const usuario = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: ``,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const emailInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(emailInvalido);
  });

  it("usuário com email inválido - sem @", async () => {
    const usuario = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `test@ndo_${timestamp}email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const emailInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(emailInvalido);
  });

  it("usuário com email inválido - sem domínio", async () => {
    const usuario = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `test@ndo_${timestamp}@`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const emailInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(emailInvalido);
  });

  it("usuário com email inválido - domínio com caracter especiais", async () => {
    const usuario = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `test@ndo_${timestamp}@em@il.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const emailInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(emailInvalido);
  });

  it("usuário com email repetido", async () => {
    const userTest = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const usuario = await request(app)
      .post("/api/users")
      .send(userTest);

    const emailRepetido = await request(app)
      .post("/api/users")
      .send(usuario.body);

    expectError400(emailRepetido);
  });

  it("usuário com senha inválida", async () => {
    const usuario = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "",
      dtNascimento: "2000-01-01"
    };

    const senhaInvalida = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(senhaInvalida);
  });

  it("usuário com data nascimento inválida - alfabeto ", async () => {
    const dataInvalida = await request(app)
      .post("/api/users")
      .send({
        nome: "Teste",
        username: "teste",
        email: "teste@email.com",
        senha: "123456",
        dtNascimento: "abc"
      });

    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - ordem incorreta ", async () => {
    const dataInvalida = await request(app)
      .post("/api/users")
      .send({
        nome: "Teste",
        username: "teste",
        email: "teste@email.com",
        senha: "123456",
        dtNascimento: "18-10-2000"
      });

    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - ano incorreto ", async () => {
    const dataInvalida = await request(app)
      .post("/api/users")
      .send({
        nome: "Teste",
        username: "teste",
        email: "teste@email.com",
        senha: "123456",
        dtNascimento: "200-10-10"
      });

    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - mes incorreto ", async () => {
    const dataInvalida = await request(app)
      .post("/api/users")
      .send({
        nome: "Teste",
        username: "teste",
        email: "teste@email.com",
        senha: "123456",
        dtNascimento: "2000-13-10"
      });

    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - dia incorreto ", async () => {
    const dataInvalida = await request(app)
      .post("/api/users")
      .send({
        nome: "Teste",
        username: "teste",
        email: "teste@email.com",
        senha: "123456",
        dtNascimento: "2000-10-32"
      });
    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - ano incorreto ", async () => {
    const dataInvalida = await request(app)
      .post("/api/users")
      .send({
        nome: "Teste",
        username: "teste",
        email: "teste@email.com",
        senha: "123456",
        dtNascimento: ""
      });

    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - formato brasileiro ", async () => {
    const dataInvalida = await request(app)
      .post("/api/users")
      .send({
        nome: "Teste",
        username: "teste",
        email: "teste@email.com",
        senha: "123456",
        dtNascimento: "18-10-2000"
      });
    expectError400(dataInvalida);
  });

  it("não deve criar usuário sem campos obrigatórios", async () => {
    const camposObrigatorios = [
      "nome",
      "username",
      "email",
      "senha",
      "dtNascimento"
    ];

    for (const campo of camposObrigatorios) {
      const usuario = {
        nome: "Teste",
        username: "teste",
        email: "teste@email.com",
        senha: "123456",
        dtNascimento: "2000-01-01"
      };

      delete usuario[campo as keyof typeof usuario]; // deleta um campo como uma chave do tipo do objeto usuario

      const testeUsuario = await request(app)
        .post("/api/users")
        .send(usuario);

      expectError400(testeUsuario);
    }
  });

  it("login: email ou username + senha: 'incorreta'", async () => {
    const timestamp = Date.now();
    const userTest = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };
    // criar usuário
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    expectCreateUser(createUser, userTest);

    //login com senha errada → email
    const loginEmail = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.email, // email
        senha: "incorreta"
      });

    expectError400(loginEmail);

    //login com senha errada → username
    const loginUsername = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.username, //username++
        senha: "incorreta"
      });

    expectError400(loginUsername);
  });
});

// // *******************************************************************************************************
// // *******************************************************************************************************

describe("Autenticação Tweet", () => {
  it("tenta criar um tweet sem um token válido.", async () => {
    const timestamp = Date.now();
    const userTest = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };
    // tenta criar um tweet sem token válido
    const tweetSemToken = await request(app)
      .post("/api/tweets")
      .send({
        conteudo: `Datenow() é: ${timestamp}`
      });

    expectError401(tweetSemToken);
  });

  it("fluxo do usuário → válidar: tweet vazio e válidar: tweet maior que 280 caracteres.", async () => {
    const timestamp = Date.now();
    const userTest = {
      nome: `Teste${timestamp}`,
      username: `teste${timestamp}`,
      email: `teste_${timestamp}@email.com`,
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    // criar usuário
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    expectCreateUser(createUser, userTest);


    //login
    const loginEmail = await request(app)
      .post("/api/auth/login")
      .send({
        login: createUser.body.usuario.email,
        senha: userTest.senha
      });

    expectLogin(loginEmail, userTest);

    //token válido recebido
    const token = loginEmail.body.token;

    const tweetEmpty = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: ""
      });
      
    expectError400(tweetEmpty);

    // tweetando com 281 caracteres
    const tweetContentTooLong = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: "a".repeat(281)
      });

    expectError400(tweetContentTooLong);
  });
  // // *******************************************************************************************************
  // // *******************************************************************************************************

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
});