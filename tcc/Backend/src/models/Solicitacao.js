import mongoose from "mongoose";

const solicitacaoSchema = new mongoose.Schema(
    {
        adotante: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },

        animal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Animal",
            required: true
        },

        mensagem: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Pendente", "Aprovada", "Recusada"],
            default: "Pendente"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Solicitacao",
    solicitacaoSchema
);