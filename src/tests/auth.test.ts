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

function expectError403(response: any) {
  expect(response.status).toBe(403);
  expect(response.body.ok).toBe(false);
  expect(response.body).toHaveProperty("message");
  expect(typeof response.body.message).toBe("string");
}

describe("Fluxo completo", () => {
  let token: string;

  const userTest = {
    nome: "Teste",
    username: "teste",
    email: "teste@email.com",
    senha: "123456",
    dtNascimento: "2000-01-01"
  };

  // criando fluxo teste
  beforeAll(async () => {

    // criar usuário
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    expectCreateUser(createUser, userTest);

    //login
    const loginEmailTeste = await request(app)
      .post("/api/auth/login")
      .send({
        login: createUser.body.usuario.email,
        senha: userTest.senha
      });

    expectLogin(loginEmailTeste, userTest);
    //token válido recebido
    token = loginEmailTeste.body.token;
  });

  it("criar tweet → update → delete → check delete", async () => {
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

  afterAll(async () => {
    await prisma.usuario.deleteMany({
      where: {
        email: "teste@email.com"
      }
    });
  });
});

// *******************************************************************************************************

describe("Autenticação usuário", () => {
  const userTest = {
    nome: "Teste",
    username: "teste",
    email: "teste@email.com",
    senha: "123456",
    dtNascimento: "2000-01-01"
  };

  // criando fluxo teste
  beforeAll(async () => {
    // criar usuário
    const createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    expectCreateUser(createUser, userTest);

    //login
    const loginEmailTeste = await request(app)
      .post("/api/auth/login")
      .send({
        login: createUser.body.usuario.email,
        senha: userTest.senha
      });

    expectLogin(loginEmailTeste, userTest);
    //token válido recebido
    const token = loginEmailTeste.body.token;
  });
  it("usuário com nome inválido - vazio", async () => {
    const usuario = {
      ...userTest,
      nome: ""
    };
    const nomeInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(nomeInvalido);
  });

  it("usuário com nome inválido - caracter especiais", async () => {
    const usuario = {
      ...userTest,
      nome: "m@theus"
    };

    const nomeInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(nomeInvalido);
  });

  it("usuário com username inválido - vazio", async () => {
    const usuario = {
      ...userTest,
      username: ""
    };
    const usernameInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(usernameInvalido);
  });

  it("usuário com username inválido - caracter especiais", async () => {
    const usuario = {
      ...userTest,
      username: "m@theus"
    };

    const username = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(username);
  });

  it("usuário com username repetido", async () => {

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
      ...userTest,
      email: ""
    };

    const emailInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(emailInvalido);
  });

  it("usuário com email inválido - sem @", async () => {
    const usuario = {
      ...userTest,
      email: "matheusdominio.com"
    };
    const emailInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(emailInvalido);
  });

  it("usuário com email inválido - sem domínio", async () => {
    const usuario = {
      ...userTest,
      email: "matheus@.com"
    };

    const emailInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(emailInvalido);
  });

  it("usuário com email inválido - sem extensão .com", async () => {
    const usuario = {
      ...userTest,
      email: "matheus@dominio"
    };

    const emailInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(emailInvalido);
  });

  it("usuário com email inválido - domínio com caracter especiais", async () => {
    const usuario = {
      ...userTest,
      email: "matheus@d@minio.com"
    };

    const emailInvalido = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(emailInvalido);
  });

  it("usuário com email repetido", async () => {
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
      ...userTest,
      senha: ""
    };

    const senhaInvalida = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(senhaInvalida);
  });

  it("usuário com data nascimento inválida - letras ", async () => {
    const usuario = {
      ...userTest,
      dtNascimento: "abc"
    };

    const dataInvalida = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - ordem incorreta ", async () => {
    const usuario = {
      ...userTest,
      dtNascimento: "06-05-2026"
    };

    const dataInvalida = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - ano incorreto ", async () => {
    const usuario = {
      ...userTest,
      dtNascimento: "206-10-10"
    };

    const dataInvalida = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - mes incorreto ", async () => {
    const usuario = {
      ...userTest,
      dtNascimento: "2026-15-10"
    };

    const dataInvalida = await request(app)
      .post("/api/users")
      .send(usuario);

    expectError400(dataInvalida);
  });

  it("usuário com data nascimento inválida - dia incorreto ", async () => {
    const usuario = {
      ...userTest,
      dtNascimento: "2026-10-32"
    };

    const dataInvalida = await request(app)
      .post("/api/users")
      .send(usuario);

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
    //login com senha errada → email
    const loginEmailTeste = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.email, // email
        senha: "incorreta"
      });

    expectError400(loginEmailTeste);

    //login com senha errada → username
    const loginUsername = await request(app)
      .post("/api/auth/login")
      .send({
        login: userTest.username, //username++
        senha: "incorreta"
      });

    expectError400(loginUsername);
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({
      where: {
        email: "teste@email.com"
      }
    });
  });
});

// // *******************************************************************************************************

describe("Autenticação Tweet", () => {
  let createUser: any;
  let loginEmailTeste: any;
  let token: string;
  let tweetTeste: any;

  const timestamp = Date.now();
  const userTest = {
    nome: "Teste",
    username: "teste",
    email: "teste@email.com",
    senha: "123456",
    dtNascimento: "2000-01-01"
  };
  // criando fluxo teste
  beforeAll(async () => {

    // criar usuário
    createUser = await request(app)
      .post("/api/users")
      .send(userTest);

    expectCreateUser(createUser, userTest);

    //login
    loginEmailTeste = await request(app)
      .post("/api/auth/login")
      .send({
        login: createUser.body.usuario.email,
        senha: userTest.senha
      });

    expectLogin(loginEmailTeste, userTest);

    //token válido recebido
    token = loginEmailTeste.body.token;

    // criando tweet teste
    tweetTeste = await request(app)
      .post(`/api/tweets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: "Tweet que vai ser curtido."
      })

    expectCreateTweet(tweetTeste);
  });

  it("tenta criar um tweet sem um token válido.", async () => {
    // tenta criar um tweet sem token válido
    const tweetSemToken = await request(app)
      .post("/api/tweets")
      .send({
        conteudo: `Datenow() é: ${timestamp}`
      });

    expectError401(tweetSemToken);
  });

  it("fluxo do usuário → válidar: tweet vazio.", async () => {
    const tweetEmpty = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: ""
      });

    expectError400(tweetEmpty);
  })

  it("validando tweet maior que 280 caracteres.", async () => {
    // tweetando com 281 caracteres
    const tweetContentTooLong = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: "a".repeat(281)
      });

    expectError400(tweetContentTooLong);
  });

  it("usuario logado da reply em tweet existente", async () => {
    const reply = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: "Respondendo tweet pai!",
        replyId: tweetTeste.body.tweet.tweetId
      });

    expect(reply.status).toBe(201); // status 201
    expect(reply.body.ok).toBe(true); //ok === true

    expect(reply.body.tweet).toHaveProperty("usuarioId"); // deve conter a prop. usuarioId
    expect(reply.body.tweet).toHaveProperty("tweetId"); // deve conter a prop. tweetId
    expect(reply.body.tweet).toHaveProperty("conteudo"); // deve conter a prop. conteudo
    expect(reply.body.tweet).toHaveProperty("replyId"); // deve conter a prop. replyId
    expect(reply.body.tweet).toHaveProperty("replyTo"); // deve conter a prop. replyTo

    expect(typeof reply.body.tweet.tweetId).toBe("string"); // type string
    expect(typeof reply.body.tweet.conteudo).toBe("string"); // type string
    expect(typeof reply.body.tweet.usuarioId).toBe("string"); // type string
    expect(typeof reply.body.tweet.replyId).toBe("string"); // type string
    expect(typeof reply.body.tweet.replyTo).toBe("object"); // type object
  });

  it("usuario logado da like em tweet existente", async () => {
    const like = await request(app)
      .post(`/api/likes/${tweetTeste.body.tweet.tweetId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(like.status).toBe(201);
    expect(like.body.ok).toBe(true); //ok === true
    expect(like.body).toHaveProperty("action");
  });

  it("usuario logado da unlike em tweet existente", async () => {
    const unlike = await request(app)
      .post(`/api/likes/${tweetTeste.body.tweet.tweetId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(unlike.status).toBe(200);
    expect(unlike.body.ok).toBe(true); //ok === true
    expect(unlike.body).toHaveProperty("action");
  });
  afterAll(async () => {
    await prisma.usuario.deleteMany({
      where: {
        email: "teste@email.com"
      }
    });
  });
});

// // *******************************************************************************************************
// // *******************************************************************************************************

describe("Autorização e Follow", () => {
  let tokenUsuarioA: string;
  let tokenUsuarioB: string;
  let usuarioA: any;
  let usuarioB: any;
  let tweetUsuarioA: any;

  beforeAll(async () => {
    usuarioA = {
      nome: "Teste A",
      username: "testea",
      email: "testea@email.com",
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    usuarioB = {
      nome: "Teste B",
      username: "testeb",
      email: "testeb@email.com",
      senha: "123456",
      dtNascimento: "2000-01-01"
    };

    const criarUsuarioA = await request(app)
      .post("/api/users")
      .send(usuarioA);

    const criarUsuarioB = await request(app)
      .post("/api/users")
      .send(usuarioB);

    expectCreateUser(criarUsuarioA, usuarioA);
    expectCreateUser(criarUsuarioB, usuarioB);

    usuarioA.id = criarUsuarioA.body.usuario.id;
    usuarioB.id = criarUsuarioB.body.usuario.id;

    const loginA = await request(app)
      .post("/api/auth/login")
      .send({
        login: usuarioA.email,
        senha: usuarioA.senha
      });

    const loginB = await request(app)
      .post("/api/auth/login")
      .send({
        login: usuarioB.email,
        senha: usuarioB.senha
      });

    expectLogin(loginA, usuarioA);
    expectLogin(loginB, usuarioB);

    tokenUsuarioA = loginA.body.token;
    tokenUsuarioB = loginB.body.token;

    // criando twwet para testar se usuarioB consegue alterar
    tweetUsuarioA = await request(app)
      .post("/api/tweets")
      .set("Authorization", `Bearer ${tokenUsuarioA}`)
      .send({
        conteudo: "Tweet do usuário A"
      });

    expectCreateTweet(tweetUsuarioA);
  });

  it("usuário deve seguir outro usuário", async () => {
    const follow = await request(app)
      .post(`/api/follows/${usuarioB.id}`)
      .set("Authorization", `Bearer ${tokenUsuarioA}`);

    expect(follow.status).toBe(201);
    expect(follow.body.ok).toBe(true);
    expect(follow.body).toHaveProperty("action");
  });

  it("usuário deve deixar de seguir outro usuário", async () => {
    const unfollow = await request(app)
      .post(`/api/follows/${usuarioB.id}`)
      .set("Authorization", `Bearer ${tokenUsuarioA}`);

    expect(unfollow.status).toBe(200);
    expect(unfollow.body.ok).toBe(true);
    expect(unfollow.body).toHaveProperty("action");
  });

  it("usuário não pode seguir a si mesmo", async () => {
    const meSeguir = await request(app)
      .post(`/api/follows/${usuarioA.id}`)
      .set("Authorization", `Bearer ${tokenUsuarioA}`);

    expectError400(meSeguir);
  });

  it("usuárioB não deve atualizar tweet do usuárioA", async () => {
    const updateTweet = await request(app)
      .put(`/api/tweets/${tweetUsuarioA.body.tweet.tweetId}`)
      .set("Authorization", `Bearer ${tokenUsuarioB}`)
      .send({
        conteudo: "Tentando alterar tweet de outro usuário"
      });

    expectError403(updateTweet);
  });

  it("usuárioB não pode deletar tweet outro usuárioA", async () => {
    const deleteTweet = await request(app)
      .delete(`/api/tweets/${tweetUsuarioA.body.tweet.tweetId}`)
      .set("Authorization", `Bearer ${tokenUsuarioB}`);

    expectError403(deleteTweet);
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({
      where: {
        email: {
          in: [usuarioA.email, usuarioB.email]
        }
      }
    });
  });
});

// // *******************************************************************************************************
// // *******************************************************************************************************

afterAll(async () => {
  await prisma.$disconnect();
  await pool.end();
});