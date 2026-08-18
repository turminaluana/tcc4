import "dotenv/config";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Usuario from "../models/Usuario.js";

async function seed() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB conectado.");

        const senha =
            await bcrypt.hash("admin123", 10);

        const adminExistente =
            await Usuario.findOne({
                cpf: "00000000000"
            });

        if (adminExistente) {

            console.log(
                "Administrador já existe."
            );

        } else {

            await Usuario.create({

                nome: "Administrador",

                cpf: "00000000000",

                telefone: "000000000",

                endereco: "Sistema",

                senha,

                tipo: "admin"

            });

            console.log(
                "Administrador criado com sucesso!"
            );
        }

    } catch (error) {

        console.error(
            "Erro no seed:",
            error.message
        );

    } finally {

        await mongoose.disconnect();

        console.log(
            "Conexão encerrada."
        );
    }
}

seed();