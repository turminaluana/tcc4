import mongoose from "mongoose";

const solicitacaoSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },

        animal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Animal",
            required: true
        },

        status: {
            type: String,
            enum: ["pendente", "aprovada", "recusada", 'cancelada'],
            default: "pendente"
        },

        mensagem: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Solicitacao = mongoose.model(
    "Solicitacao",
    solicitacaoSchema
);

export default Solicitacao;