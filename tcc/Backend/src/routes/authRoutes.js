import express from "express";

import {
    login
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.get("/", (req, res) => {
    res.json({
        mensagem: "Rota de autenticação funcionando!"
    });
});

export default router;