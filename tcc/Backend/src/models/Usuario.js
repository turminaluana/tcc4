import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true
        },

        cpf: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        telefone: {
            type: String,
            required: true,
            trim: true
        },

        endereco: {
            type: String,
            required: true,
            trim: true
        },

        senha: {
            type: String,
            required: true
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

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;