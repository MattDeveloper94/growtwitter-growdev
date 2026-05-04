import request from "supertest";
import app from "../app";
import { prisma, pool } from "../database/prismadb";

describe("Auth", () => {
  it("login deve retornar 200", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        login: "matteo@gmail.com",
        senha: "123456"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  await pool.end();
});