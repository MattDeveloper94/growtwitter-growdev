import { AppError } from "../../middlewares/error.handler";
import { CreateUsuarioDto } from "../dtos/usuario.dto";
import { UsuarioRepository } from "../repositories/usuario.repository";

const usuarioRepository = new UsuarioRepository();

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const camposObrigatorios: (keyof CreateUsuarioDto)[] = [
    "nome",
    "username",
    "email",
    "senha",
    "dtNascimento"
];

export class UsuarioService {
    async createUsuario(dados: CreateUsuarioDto) {

        //validacao
        for (const campo of camposObrigatorios) {
            //buscando o valor pela lista
            if (!dados[campo])
                throw new AppError(`O campo ${campo} é obrigatório.`, 400);

            if (dados[campo] === null || dados[campo] === "") {
                throw new AppError(`O valor do campo ${campo} está vazio.`, 400);
            }
        }

        const nomeInvalido = /[^a-zA-ZÀ-ÿ0-9\s]/g;

        if (nomeInvalido.test(dados.nome))
            throw new AppError("Nome inválido.", 400);

        //padrozinacao
        dados.nome = dados.nome
            .trim()
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map(
                palavra =>
                    palavra.charAt(0).toUpperCase() +
                    palavra.slice(1)
            )
            .join(" ");

        dados.username = dados.username
            .trim()
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .join("");


        dados.email = dados.email
            .trim()
            .toLowerCase()


        // validacao e-mail
        if (!emailValido.test(dados.email))
            throw new AppError("E-mail inválido.", 400);

        //criando usuario
        const usuarioCriado = await usuarioRepository.createUsuario(dados);

        //removendo senha do usuario pra log
        const { senha, ...usuarioSemSenha } = usuarioCriado;

        return {
            ok: true,
            usuario: usuarioSemSenha
        }
    }

    async obterUsuarioPorId(usuarioId: string) {

        if (!usuarioId) {
            throw new AppError("ID do usuário não encontrado.", 400);
        }
        const usuario = await usuarioRepository.obterUsuarioPorId(usuarioId);

        if (!usuario) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        const { senha, ...usuarioSemSenha } = usuario;

        return {
            ok: true,
            usuario: usuarioSemSenha
        };
    }
}