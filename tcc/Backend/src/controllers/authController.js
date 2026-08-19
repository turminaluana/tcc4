import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

export async function cadastrar(req, res) {
    try {
        const {
            nome,
            cpf,
            email,
            telefone,
            endereco,
            senha,
            tipo
        } = req.body;

        if (
            !nome ||
            !cpf ||
            !email ||
            !telefone ||
            !endereco ||
            !senha
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        const emailNormalizado = email.toLowerCase().trim();

        const usuarioExistente = await Usuario.findOne({
            $or: [
                { email: emailNormalizado },
                { cpf: cpf }
            ]
        });

        if (usuarioExistente) {
            if (usuarioExistente.email === emailNormalizado) {
                return res.status(400).json({
                    mensagem: "Este email já está cadastrado."
                });
            }

            if (usuarioExistente.cpf === cpf) {
                return res.status(400).json({
                    mensagem: "Este CPF já está cadastrado."
                });
            }
        }

        const senhaCriptografada = await bcrypt.hash(
            senha,
            10
        );

        const usuario = await Usuario.create({
            nome,
            cpf,
            email: emailNormalizado,
            telefone,
            endereco,
            senha: senhaCriptografada,
            tipo: tipo || "adotante"
        });

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                cpf: usuario.cpf,
                email: usuario.email,
                telefone: usuario.telefone,
                endereco: usuario.endereco,
                tipo: usuario.tipo
            }
        });

    } catch (error) {
        console.error("ERRO AO CADASTRAR:", error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuário.",
            erro: error.message
        });
    }
}


export async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Email e senha são obrigatórios."
            });
        }

        const emailNormalizado = email.toLowerCase().trim();

        const usuario = await Usuario.findOne({
            email: emailNormalizado
        });

        if (!usuario) {
            return res.status(401).json({
                mensagem: "Email ou senha incorretos."
            });
        }

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: "Email ou senha incorretos."
            });
        }

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                cpf: usuario.cpf,
                email: usuario.email,
                telefone: usuario.telefone,
                endereco: usuario.endereco,
                tipo: usuario.tipo
            }
        });

    } catch (error) {
        console.error("ERRO AO FAZER LOGIN:", error);

        return res.status(500).json({
            mensagem: "Erro ao realizar login.",
            erro: error.message
        });
    }
}