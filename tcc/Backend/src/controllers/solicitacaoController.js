import Solicitacao from "../models/Solicitacao.js";
import Animal from "../models/Animal.js";
import Usuario from "../models/Usuario.js";

/* CRIAR SOLICITAÇÃO */
export async function criarSolicitacao(req, res) {
  try {
    const { usuario, animal, mensagem } = req.body;

    if (!usuario) {
      return res.status(400).json({ mensagem: "Usuário é obrigatório." });
    }

    if (!animal) {
      return res.status(400).json({ mensagem: "Animal é obrigatório." });
    }

    const usuarioEncontrado = await Usuario.findById(usuario);
    if (!usuarioEncontrado) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    const animalEncontrado = await Animal.findById(animal);
    if (!animalEncontrado) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    if (!animalEncontrado.disponivel) {
      return res.status(400).json({
        mensagem: "Este animal não está mais disponível para adoção."
      });
    }

    const solicitacaoExistente = await Solicitacao.findOne({
      usuario,
      animal,
      status: { $ne: "cancelada" }
    });

    if (solicitacaoExistente) {
      return res.status(400).json({
        mensagem: "Você já possui uma solicitação ativa para este animal."
      });
    }

    const solicitacao = await Solicitacao.create({
      usuario,
      animal,
      mensagem: mensagem || ""
    });

    const solicitacaoCompleta = await Solicitacao.findById(solicitacao._id)
      .populate("usuario", "nome email telefone endereco")
      .populate("animal", "nome especie raca idade sexo imagem");

    return res.status(201).json({
      mensagem: "Solicitação de adoção criada com sucesso!",
      solicitacao: solicitacaoCompleta
    });
  } catch (error) {
    console.error("ERRO AO CRIAR SOLICITAÇÃO:", error);
    return res.status(500).json({
      mensagem: "Erro ao criar solicitação.",
      erro: error.message
    });
  }
}

/* LISTAR SOLICITAÇÕES (COM FILTRO POR USUÁRIO) */
export async function listarSolicitacoes(req, res) {
  try {
    const { usuario } = req.query;
    const filtro = usuario ? { usuario } : {};

    const solicitacoes = await Solicitacao.find(filtro)
      .populate("usuario", "nome email cpf telefone endereco")
      .populate("animal", "nome especie raca idade sexo imagem")
      .sort({ createdAt: -1 });

    return res.status(200).json(solicitacoes);
  } catch (error) {
    console.error("ERRO AO LISTAR SOLICITAÇÕES:", error);
    return res.status(500).json({
      mensagem: "Erro ao listar solicitações.",
      erro: error.message
    });
  }
}

/* ATUALIZAR SOLICITAÇÃO (GARANTINDO O EXPORT) */
export async function atualizarSolicitacao(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ mensagem: "O status é obrigatório." });
    }

    const solicitacao = await Solicitacao.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!solicitacao) {
      return res.status(404).json({ mensagem: "Solicitação não encontrada." });
    }

    if (status === "aprovada") {
      await Animal.findByIdAndUpdate(solicitacao.animal, { disponivel: false });
    }

    return res.status(200).json({
      mensagem: "Solicitação atualizada com sucesso!",
      solicitacao
    });
  } catch (error) {
    console.error("ERRO AO ATUALIZAR SOLICITAÇÃO:", error);
    return res.status(500).json({
      mensagem: "Erro ao atualizar solicitação.",
      erro: error.message
    });
  }
}

/* REMOVER SOLICITAÇÃO */
export async function removerSolicitacao(req, res) {
  try {
    const { id } = req.params;
    const solicitacao = await Solicitacao.findByIdAndDelete(id);

    if (!solicitacao) {
      return res.status(404).json({ mensagem: "Solicitação não encontrada." });
    }

    return res.status(200).json({
      mensagem: "Solicitação removida com sucesso!"
    });
  } catch (error) {
    console.error("ERRO AO REMOVER SOLICITAÇÃO:", error);
    return res.status(500).json({
      mensagem: "Erro ao remover solicitação.",
      erro: error.message
    });
  }
}

/* CANCELAR SOLICITAÇÃO */
export async function cancelarSolicitacao(req, res) {
  try {
    const { id } = req.params;

    const solicitacao = await Solicitacao.findByIdAndUpdate(
      id,
      { status: "cancelada" },
      { returnDocument: "after", runValidators: true }
    );

    if (!solicitacao) {
      return res.status(404).json({ mensagem: "Solicitação não encontrada." });
    }

    return res.status(200).json({
      mensagem: "Solicitação cancelada com sucesso!",
      solicitacao
    });
  } catch (error) {
    console.error("ERRO AO CANCELAR SOLICITAÇÃO:", error);
    return res.status(500).json({
      mensagem: "Erro ao cancelar solicitação.",
      erro: error.message
    });
  }
}