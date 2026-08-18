import express from "express";

import {
    criarSolicitacao,
    listarSolicitacoes,
    atualizarSolicitacao,
    removerSolicitacao
} from "../controllers/solicitacaoController.js";

import {
    autenticar,
    somenteAdmin
} from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/",
    autenticar,
    criarSolicitacao
);

router.get(
    "/",
    autenticar,
    listarSolicitacoes
);

router.put(
    "/:id",
    autenticar,
    somenteAdmin,
    atualizarSolicitacao
);

router.delete(
    "/:id",
    autenticar,
    removerSolicitacao
);

export default router;