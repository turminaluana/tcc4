import Animal from "../models/Animal.js";

export async function criarAnimal(req, res) {
    try {

        const {
            nome,
            especie,
            raca,
            idade,
            sexo,
            descricao,
            foto
        } = req.body;

        if (!nome || !especie || !idade || !sexo) {
            return res.status(400).json({
                mensagem: "Nome, espécie, idade e sexo são obrigatórios."
            });
        }

        const animal = await Animal.create({
            nome,
            especie,
            raca,
            idade,
            sexo,
            descricao,
            foto,
            disponivel: true
        });

        return res.status(201).json({
            mensagem: "Animal cadastrado com sucesso.",
            animal
        });

    } catch (error) {

        console.error("ERRO AO CADASTRAR ANIMAL:", error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar animal.",
            erro: error.message
        });
    }
}

export async function listarAnimais(req, res) {
    try {

        const animais = await Animal.find();

        return res.json(animais);

    } catch (error) {

        console.error("ERRO AO LISTAR ANIMAIS:", error);

        return res.status(500).json({
            mensagem: "Erro ao buscar animais.",
            erro: error.message
        });
    }
}

export async function buscarAnimal(req, res) {
    try {
        const animal = await Animal.findById(
            req.params.id
        );

        if (!animal) {
            return res.status(404).json({
                mensagem: "Animal não encontrado."
            });
        }

        res.json(animal);

    } catch (error) {

        res.status(500).json({
            mensagem: "Erro ao buscar animal."
        });
    }
}

export async function atualizarAnimal(req, res) {
    try {
        const { id } = req.params;

        const {
            nome,
            especie,
            raca,
            idade,
            sexo,
            descricao,
            foto,
            disponivel
        } = req.body;

        const animal = await Animal.findById(id);

        if (!animal) {
            return res.status(404).json({
                mensagem: "Animal não encontrado."
            });
        }

        if (nome !== undefined) animal.nome = nome;
        if (especie !== undefined) animal.especie = especie;
        if (raca !== undefined) animal.raca = raca;
        if (idade !== undefined) animal.idade = idade;
        if (sexo !== undefined) animal.sexo = sexo;
        if (descricao !== undefined) animal.descricao = descricao;
        if (foto !== undefined) animal.foto = foto;
        if (disponivel !== undefined) animal.disponivel = disponivel;

        await animal.save();

        return res.json({
            mensagem: "Animal atualizado com sucesso.",
            animal
        });

    } catch (error) {
        console.error("ERRO AO ATUALIZAR ANIMAL:", error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar animal.",
            erro: error.message
        });
    }
}


export async function excluirAnimal(req, res) {
    try {
        const { id } = req.params;

        const animal = await Animal.findById(id);

        if (!animal) {
            return res.status(404).json({
                mensagem: "Animal não encontrado."
            });
        }

        await Animal.findByIdAndDelete(id);

        return res.json({
            mensagem: "Animal excluído com sucesso."
        });

    } catch (error) {
        console.error("ERRO AO EXCLUIR ANIMAL:", error);

        return res.status(500).json({
            mensagem: "Erro ao excluir animal.",
            erro: error.message
        });
    }
}