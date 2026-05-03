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
                throw new Error(`O campo ${campo} é obrigatório.`)

            if (dados[campo] === null || dados[campo] === "") {
                throw new Error(`O valor do campo ${campo} está vazio.`)
            }
        }

        //padrozinacao
        dados.nome = dados.nome.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, "")
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

        dados.username = dados.username.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, "")
            .trim()
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map(
                palavra =>
                    palavra.charAt(0).toUpperCase() +
                    palavra.slice(1)
            )
            .join("");


        dados.email = dados.email
            .trim()
            .toLowerCase()


        // validacao e-mail
        if (!emailValido.test(dados.email))
            throw new Error(`E-mail inválido.`)

        //criando usuario
        const usuarioCriado = await usuarioRepository.createUsuario(dados);

        //removendo senha do usuario pra log
        const { senha, ...usuarioSemSenha } = usuarioCriado;

        console.log('✅ Usuario criado:', usuarioSemSenha);
        return {
            ok: true,
            usario: usuarioSemSenha
        }
    }
}