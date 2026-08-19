import express from "express";

import {
    criarUsuario,
    listarUsuarios,
    buscarUsuario,
    atualizarUsuario,
    removerUsuario
} from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", criarUsuario);

router.get("/", listarUsuarios);

router.get("/:id", buscarUsuario);

router.put("/:id", atualizarUsuario);

router.delete("/:id", removerUsuario);

export default router;