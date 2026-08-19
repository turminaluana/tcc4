import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true
        },

        especie: {
            type: String,
            required: true,
            enum: ["cachorro", "gato", "outro"]
        },

        raca: {
            type: String,
            required: true,
            trim: true
        },

        idade: {
            type: Number,
            required: true,
            min: 0
        },

        sexo: {
            type: String,
            required: true,
            enum: ["macho", "femea"]
        },

        descricao: {
            type: String,
            required: true,
            trim: true
        },

        imagem: {
            type: String,
            default: ""
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

const Animal = mongoose.model("Animal", animalSchema);

export default Animal;