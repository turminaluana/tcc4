import Solicitacao from "../models/Solicitacao.js";
import Animal from "../models/Animal.js";

export async function criarSolicitacao(req, res) {

    try {

        const { animal, mensagem } = req.body;

        const animalEncontrado =
            await Animal.findById(animal);

        if (!animalEncontrado) {
            return res.status(404).json({
                mensagem: "Animal não encontrado."
            });
        }

        if (!animalEncontrado.disponivel) {
            return res.status(400).json({
                mensagem: "Este animal não está disponível."
            });
        }

        const solicitacao =
            await Solicitacao.create({
                adotante: req.usuario.id,
                animal,
                mensagem
            });

        res.status(201).json(solicitacao);

    } catch (error) {

        res.status(400).json({
            mensagem: "Erro ao criar solicitação.",
            erro: error.message
        });
    }
}

export async function listarSolicitacoes(req, res) {

    try {

        let filtro = {};

        if (req.usuario.tipo !== "admin") {
            filtro.adotante = req.usuario.id;
        }

        const solicitacoes =
            await Solicitacao
                .find(filtro)
                .populate(
                    "adotante",
                    "nome cpf telefone"
                )
                .populate(
                    "animal",
                    "nome especie raca idade"
                );

        res.json(solicitacoes);

    } catch (error) {

        res.status(500).json({
            mensagem: "Erro ao listar solicitações."
        });
    }
}

export async function atualizarSolicitacao(req, res) {

    try {

        const { status } = req.body;

        const solicitacao =
            await Solicitacao.findByIdAndUpdate(
                req.params.id,
                { status },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!solicitacao) {
            return res.status(404).json({
                mensagem: "Solicitação não encontrada."
            });
        }

        if (status === "Aprovada") {

            await Animal.findByIdAndUpdate(
                solicitacao.animal,
                {
                    disponivel: false
                }
            );
        }

        res.json(solicitacao);

    } catch (error) {

        res.status(400).json({
            mensagem: "Erro ao atualizar solicitação.",
            erro: error.message
        });
    }
}

export async function removerSolicitacao(req, res) {

    try {

        const solicitacao =
            await Solicitacao.findByIdAndDelete(
                req.params.id
            );

        if (!solicitacao) {
            return res.status(404).json({
                mensagem: "Solicitação não encontrada."
            });
        }

        res.json({
            mensagem: "Solicitação removida com sucesso."
        });

    } catch (error) {

        res.status(500).json({
            mensagem: "Erro ao remover solicitação."
        });
    }
}