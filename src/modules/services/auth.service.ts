import { UsuarioRepository } from "../repositories/usuario.repository";
import { LoginUsuarioDto } from "../dtos/auth.dto";
import jwt from "jsonwebtoken";

const usuarioRepository = new UsuarioRepository();

export class AuthService {
    async login(dados: LoginUsuarioDto) {

        //validacao email
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let usuario;

        if (!dados.login || !dados.senha)
            throw new Error("Login e senha são obrigatórios.");

        if (emailValido.test(dados.login)) {
            usuario = await usuarioRepository.obterPorEmail(dados.login.trim().toLowerCase());
        } else
            usuario = await usuarioRepository.obterPorUsername(dados.login.trim().toLowerCase());

        //validando usuario;
        if (!usuario || usuario.senha !== dados.senha)
            throw new Error('Login ou senha inválidos!');

        //CRIANDO TOKEN - JWT
        const token = jwt.sign({
            id: usuario.id
        },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" } //  { expiresIn: 3600 } = 1h
        );

        // cria um novo objeto com os dados do usuário, removendo a senha
        const { senha, ...usuarioSemSenha } = usuario;
        console.log('✅ usuario Logado!', usuarioSemSenha);
        //saída
        return {
            ok: true,
            usuario: usuarioSemSenha,
            token
        }
    }
}