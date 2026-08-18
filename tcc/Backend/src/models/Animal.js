import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },

        especie: {
            type: String,
            required: true,
            enum: ["Cachorro", "Gato", "Outro"]
        },

        raca: {
            type: String,
            default: "Não informada"
        },

        idade: {
            type: Number,
            required: true,
            min: 0
        },

        sexo: {
            type: String,
            enum: ["Macho", "Fêmea"],
            required: true
        },

        descricao: {
            type: String,
            required: true
        },

        statusSaude: {
            type: String,
            enum: ["Saudável", "Em tratamento"],
            default: "Saudável"
        },

        disponivel: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Animal", animalSchema);