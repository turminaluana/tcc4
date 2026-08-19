import express from "express";

import {
    criarSolicitacao,
    listarSolicitacoes,
    atualizarSolicitacao,
    removerSolicitacao
} from "../controllers/solicitacaoController.js";

const router = express.Router();

router.post("/", criarSolicitacao);
router.get("/", listarSolicitacoes);
router.put("/:id", atualizarSolicitacao);
router.delete("/:id", removerSolicitacao);

export default router;