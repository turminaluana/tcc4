import express from "express";

import {
    listarAnimais,
    criarAnimal,
    atualizarAnimal,
    excluirAnimal
} from "../controllers/animalController.js";

const router = express.Router();

router.get("/", listarAnimais);

router.post("/", criarAnimal);

router.put("/:id", atualizarAnimal);

router.delete("/:id", excluirAnimal);

export default router;