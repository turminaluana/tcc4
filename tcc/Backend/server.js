import dotenv from "dotenv";

dotenv.config();


import express from "express";
import cors from "cors";

import connectDatabase from "./src/database/connection.js";

import authRoutes from "./src/routes/authRoutes.js";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import animalRoutes from "./src/routes/animalRoutes.js";
import solicitacaoRoutes from "./src/routes/solicitacaoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/animais", animalRoutes);
app.use("/api/solicitacoes", solicitacaoRoutes);

app.get("/", (req, res) => {
    res.json({
        mensagem: "API de Adoção de Animais funcionando!"
    });
});

const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {

    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

});