import express from "express";

import {
    criarUsuario,
    listarUsuarios,
    buscarUsuario,
    atualizarUsuario,
    removerUsuario
} from "../controllers/usuarioController.js";

import {
    autenticar,
    somenteAdmin
} from "../middleware/auth.js";

const router = express.Router();

router.post("/", criarUsuario);

router.put("/:id", atualizarUsuario);

router.get(
    "/",
    autenticar,
    somenteAdmin,
    listarUsuarios
);

router.get(
    "/:id",
    autenticar,
    buscarUsuario
);

router.put(
    "/:id",
    autenticar,
    atualizarUsuario
);

router.delete(
    "/:id",
    autenticar,
    somenteAdmin,
    removerUsuario
);

export default router;