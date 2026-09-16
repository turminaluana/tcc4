import express from "express";

import {
  criarSolicitacao,
  listarSolicitacoes,
  listarMinhasSolicitacoes, // Adicionada a função do controller
  atualizarSolicitacao,
  removerSolicitacao,
  cancelarSolicitacao
} from "../controllers/solicitacaoController.js";

const router = express.Router();

router.post("/", criarSolicitacao);
router.get("/", listarSolicitacoes); // Admin: Lista TODAS as solicitações
router.get("/minhas", listarMinhasSolicitacoes); // Usuário: Lista apenas as DELE
router.put("/:id", atualizarSolicitacao);
router.patch("/:id/cancelar", cancelarSolicitacao);
router.delete("/:id", removerSolicitacao);

export default router;