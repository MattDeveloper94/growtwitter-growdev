import { prisma } from "../../database/prismadb";
import { LoginUsuarioDto } from "../dtos/auth.dto";
import { CreateUsuarioDto } from "../dtos/usuario.dto";

export class UsuarioRepository {
    public async createUsuario(dados: CreateUsuarioDto) {
        return await prisma.usuario.create({
            data: {
                ...dados,
                dtNascimento: new Date(dados.dtNascimento)
            }
        });

    }

    public async obterPorEmail(email: string){
        return await prisma.usuario.findUnique({
            where: {
                email
            }
        });
    }

    public async obterPorUsername(username: string){
        return await prisma.usuario.findUnique({
            where: {
                username
            }
        })
    }
}