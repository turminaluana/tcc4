import Animal from "../models/Animal.js";

export async function cadastrarAnimal(req, res) {
    try {
        const {
            nome,
            especie,
            raca,
            idade,
            sexo,
            descricao,
            imagem
        } = req.body;

        if (
            !nome ||
            !especie ||
            !raca ||
            idade === undefined ||
            !sexo ||
            !descricao
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        const animal = await Animal.create({
            nome,
            especie,
            raca,
            idade,
            sexo,
            descricao,
            imagem
        });

        return res.status(201).json({
            mensagem: "Animal cadastrado com sucesso!",
            animal
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar animal."
        });
    }
}


export async function listarAnimais(req, res) {
    try {
        const animais = await Animal.find()
            .sort({ createdAt: -1 });

        return res.status(200).json(animais);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao listar animais."
        });
    }
}

export async function atualizarAnimal(req, res) {
    try {
        const { id } = req.params;

        console.log("ID recebido:", id);
        console.log("Dados recebidos:", req.body);

        const animal = await Animal.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!animal) {
            return res.status(404).json({
                mensagem: "Animal não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Animal atualizado com sucesso!",
            animal
        });

    } catch (error) {
        console.error("ERRO AO ATUALIZAR:", error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar animal.",
            erro: error.message
        });
    }
}


export async function removerAnimal(req, res) {
    try {
        const { id } = req.params;

        const animal = await Animal.findByIdAndDelete(id);

        if (!animal) {
            return res.status(404).json({
                mensagem: "Animal não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Animal removido com sucesso!"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao remover animal."
        });
    }
}