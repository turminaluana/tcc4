import Solicitacao from "../models/Solicitacao.js";
import Animal from "../models/Animal.js";
import Usuario from "../models/Usuario.js";


export async function criarSolicitacao(req, res) {

    try {

        const {
            usuario,
            animal,
            mensagem
        } = req.body;


        // Verifica usuário
        if (!usuario) {

            return res.status(400).json({
                mensagem: "Usuário é obrigatório."
            });

        }


        // Verifica animal
        if (!animal) {

            return res.status(400).json({
                mensagem: "Animal é obrigatório."
            });

        }


        // Procura usuário no MongoDB
        const usuarioEncontrado =
            await Usuario.findById(usuario);


        if (!usuarioEncontrado) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });

        }


        // Procura animal no MongoDB
        const animalEncontrado =
            await Animal.findById(animal);


        if (!animalEncontrado) {

            return res.status(404).json({
                mensagem: "Animal não encontrado."
            });

        }


        // Verifica disponibilidade
        if (!animalEncontrado.disponivel) {

            return res.status(400).json({
                mensagem:
                    "Este animal não está mais disponível para adoção."
            });

        }


        // Verifica se o usuário já solicitou esse animal
        const solicitacaoExistente =
            await Solicitacao.findOne({
                usuario,
                animal
            });


        if (solicitacaoExistente) {

            return res.status(400).json({
                mensagem:
                    "Você já solicitou a adoção deste animal."
            });

        }


        // Cria solicitação
        const solicitacao =
            await Solicitacao.create({

                usuario,

                animal,

                mensagem: mensagem || ""

            });


        // Busca os dados completos
        const solicitacaoCompleta =
            await Solicitacao
                .findById(solicitacao._id)
                .populate(
                    "usuario",
                    "nome email telefone"
                )
                .populate(
                    "animal",
                    "nome especie raca idade sexo imagem"
                );


        return res.status(201).json({

            mensagem:
                "Solicitação de adoção criada com sucesso!",

            solicitacao:
                solicitacaoCompleta

        });


    } catch (error) {

        console.error(
            "ERRO AO CRIAR SOLICITAÇÃO:",
            error
        );

        return res.status(500).json({

            mensagem:
                "Erro ao criar solicitação.",

            erro:
                error.message

        });

    }

}


/* =====================================
   LISTAR SOLICITAÇÕES
===================================== */

export async function listarSolicitacoes(req, res) {

    try {

        const solicitacoes =
            await Solicitacao
                .find()
                .populate(
                    "usuario",
                    "nome email cpf telefone"
                )
                .populate(
                    "animal",
                    "nome especie raca idade sexo imagem"
                )
                .sort({
                    createdAt: -1
                });


        return res.status(200).json(
            solicitacoes
        );


    } catch (error) {

        console.error(
            "ERRO AO LISTAR SOLICITAÇÕES:",
            error
        );

        return res.status(500).json({

            mensagem:
                "Erro ao listar solicitações.",

            erro:
                error.message

        });

    }

}


/* =====================================
   ATUALIZAR SOLICITAÇÃO
===================================== */

export async function atualizarSolicitacao(req, res) {

    try {

        const { id } = req.params;

        const { status } = req.body;


        if (!status) {

            return res.status(400).json({

                mensagem:
                    "O status é obrigatório."

            });

        }


        const solicitacao =
            await Solicitacao.findByIdAndUpdate(

                id,

                {
                    status
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!solicitacao) {

            return res.status(404).json({

                mensagem:
                    "Solicitação não encontrada."

            });

        }


        // Se aprovada, animal deixa de estar disponível
        if (status === "aprovada") {

            await Animal.findByIdAndUpdate(

                solicitacao.animal,

                {
                    disponivel: false
                }

            );

        }


        return res.status(200).json({

            mensagem:
                "Solicitação atualizada com sucesso!",

            solicitacao

        });


    } catch (error) {

        console.error(
            "ERRO AO ATUALIZAR SOLICITAÇÃO:",
            error
        );

        return res.status(500).json({

            mensagem:
                "Erro ao atualizar solicitação.",

            erro:
                error.message

        });

    }

}


/* =====================================
   REMOVER SOLICITAÇÃO
===================================== */

export async function removerSolicitacao(req, res) {

    try {

        const { id } = req.params;


        const solicitacao =
            await Solicitacao.findByIdAndDelete(id);


        if (!solicitacao) {

            return res.status(404).json({

                mensagem:
                    "Solicitação não encontrada."

            });

        }


        return res.status(200).json({

            mensagem:
                "Solicitação removida com sucesso!"

        });


    } catch (error) {

        console.error(
            "ERRO AO REMOVER SOLICITAÇÃO:",
            error
        );

        return res.status(500).json({

            mensagem:
                "Erro ao remover solicitação.",

            erro:
                error.message

        });

    }

}