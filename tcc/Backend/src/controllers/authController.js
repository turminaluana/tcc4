import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

export async function login(req, res) {
    try {

        const { cpf, senha } = req.body;

        if (!cpf || !senha) {
            return res.status(400).json({
                mensagem: "CPF e senha são obrigatórios."
            });
        }

        const usuario = await Usuario
            .findOne({ cpf })
            .select("+senha");

        if (!usuario) {
            return res.status(401).json({
                mensagem: "CPF ou senha inválidos."
            });
        }

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: "CPF ou senha inválidos."
            });
        }

        return res.json({
            mensagem: "Login realizado com sucesso.",

            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                cpf: usuario.cpf,
                tipo: usuario.tipo
            }
        });

    } catch (error) {

        console.error("ERRO NO LOGIN:", error);

        return res.status(500).json({
            mensagem: "Erro ao realizar login.",
            erro: error.message
        });
    }
}