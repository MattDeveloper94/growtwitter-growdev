import { prisma } from "../../database/prismadb";
import { CreateUsuarioDto } from "../dtos/usuario.dto";
import { hashSync } from "bcryptjs";

export class UsuarioRepository {
    public async createUsuario(dados: CreateUsuarioDto) {
        const hashPassword = hashSync(dados.senha, 8)
        return await prisma.usuario.create({
            data: {
                ...dados,
                senha: hashPassword,
                dtNascimento: new Date(dados.dtNascimento)
            }
        });

    }

    public async obterPorEmail(email: string) {
        return await prisma.usuario.findUnique({
            where: {
                email
            }
        });
    }

    public async obterPorUsername(username: string) {
        return await prisma.usuario.findUnique({
            where: {
                username
            }
        })
    }

    public async obterUsuarioPorId(usuarioId: string) {
        return await prisma.usuario.findUnique({
            where: {
                id: usuarioId
            },
            include: {
                tweets: true,
                follower: true,
                likes: true
            }
        });
    }
}