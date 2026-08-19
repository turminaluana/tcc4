import express from "express";

import {
    cadastrarAnimal,
    listarAnimais,
    atualizarAnimal,
    removerAnimal
} from "../controllers/animalController.js";

const router = express.Router();

router.post("/", cadastrarAnimal);
router.get("/", listarAnimais);
router.put("/:id", atualizarAnimal);
router.delete("/:id", removerAnimal);

export default router;