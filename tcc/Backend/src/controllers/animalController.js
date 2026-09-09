import Animal from "../models/Animal.js";

/* CADASTRAR ANIMAL */
export async function cadastrarAnimal(req, res) {
  try {
    const { nome, especie, raca, idade, sexo, descricao, imagem } = req.body;

    if (!nome || !especie || !raca || idade === undefined || !sexo || !descricao) {
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
    console.error("ERRO AO CADASTRAR ANIMAL:", error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar animal." });
  }
}

/* LISTAR ANIMAIS COM FILTRO */
export async function listarAnimais(req, res) {
  try {
    const { nome, especie, raca, sexo, idade } = req.query;

    let filtro = { disponivel: true };

    if (nome && nome.trim() !== "") {
      filtro.nome = new RegExp(nome.trim(), "i");
    }

    if (especie && especie !== "Todas espécies" && especie !== "todas") {
      filtro.especie = especie;
    }

    if (raca && raca.trim() !== "") {
      filtro.raca = new RegExp(raca.trim(), "i");
    }

    if (sexo && sexo !== "Todos sexos" && sexo !== "todos") {
      filtro.sexo = sexo;
    }

    if (idade && !isNaN(Number(idade))) {
      filtro.idade = Number(idade);
    }

    const animais = await Animal.find(filtro).sort({ createdAt: -1 });

    return res.status(200).json(animais);
  } catch (error) {
    console.error("ERRO AO LISTAR ANIMAIS:", error);
    return res.status(500).json({ mensagem: "Erro ao listar animais." });
  }
}

/* ATUALIZAR ANIMAL (EXPORTADO EXPLICITAMENTE) */
export async function atualizarAnimal(req, res) {
  try {
    const { id } = req.params;

    const animal = await Animal.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!animal) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    return res.status(200).json({
      mensagem: "Animal atualizado com sucesso!",
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

/* REMOVER ANIMAL */
export async function removerAnimal(req, res) {
  try {
    const { id } = req.params;

    const animal = await Animal.findByIdAndDelete(id);

    if (!animal) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    return res.status(200).json({ mensagem: "Animal removido com sucesso!" });
  } catch (error) {
    console.error("ERRO AO REMOVER ANIMAL:", error);
    return res.status(500).json({ mensagem: "Erro ao remover animal." });
  }
}