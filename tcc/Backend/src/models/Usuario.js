import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },

        cpf: {
            type: String,
            required: true,
            unique: true
        },

        telefone: {
            type: String,
            required: true
        },

        endereco: {
            type: String,
            required: true
        },

        senha: {
            type: String,
            required: true,
            select: false
        },

        tipo: {
            type: String,
            enum: ["admin", "adotante"],
            default: "adotante"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Usuario", usuarioSchema);