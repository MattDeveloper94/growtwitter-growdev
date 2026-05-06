import { UsuarioRepository } from "../repositories/usuario.repository";
import { LoginUsuarioDto } from "../dtos/auth.dto";
import jwt from "jsonwebtoken";

const usuarioRepository = new UsuarioRepository();

export class AuthService {
    async login(dados: LoginUsuarioDto) {

        //validacoes
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const loginInvalido = /[^a-zA-Z0-9]/;
        const isEmail = dados.login.includes("@");
        let usuario;

        if (!dados.login || !dados.senha)
            throw new Error("Login e senha são obrigatórios.");

        if (isEmail) {
            if (!emailValido.test(dados.login))
                throw new Error("E-mail inválido! O formato deve ser: email@email.com");

            usuario = await usuarioRepository.obterPorEmail(dados.login) // email
        } else {
            if (loginInvalido.test(dados.login))
                throw new Error("Username inválido. Utilize apenas letras e números.");

            usuario = await usuarioRepository.obterPorUsername(dados.login); // username
        }

        //validando usuario;
        if (!usuario)
            throw new Error('Você precisa informar o usuario no campo login!');

        if (usuario.senha !== dados.senha)
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
        //saída
        return {
            ok: true,
            usuario: usuarioSemSenha,
            token
        }
    }
}