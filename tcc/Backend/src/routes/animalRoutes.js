import express from "express";

import {
    cadastrarAnimal,
    listarAnimais,
    buscarAnimalPorId,
    atualizarAnimal,
    removerAnimal
} from "../controllers/animalController.js";

const router = express.Router();

router.post("/", cadastrarAnimal);
router.get("/", listarAnimais);
router.get("/:id", buscarAnimalPorId); // Rota para buscar um único animal pelo ID
router.put("/:id", atualizarAnimal);
router.delete("/:id", removerAnimal);

export default router;