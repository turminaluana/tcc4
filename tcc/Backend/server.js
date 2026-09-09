import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import connectDatabase from "./src/database/connection.js";

import authRoutes from "./src/routes/authRoutes.js";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import animalRoutes from "./src/routes/animalRoutes.js";
import solicitacaoRoutes from "./src/routes/solicitacaoRoutes.js";

import { criarAdmin } from "./src/utils/criarAdmin.js";

import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/animais", animalRoutes);
app.use("/api/solicitacoes", solicitacaoRoutes);

// ROTA INICIAL

app.get("/", (req, res) => {
    res.json({
        mensagem: "API de Adoção de Animais funcionando!"
    });
});

// SERVIDOR

const PORT = process.env.PORT || 3000;

// Conecta primeiro e roda a criação do admin logo em seguida
connectDatabase()
  .then(async () => {
    await criarAdmin();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar no banco de dados:", err);
  });