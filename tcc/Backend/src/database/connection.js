import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Atlas conectado com sucesso!");

    } catch (error) {

        console.error(
            "❌ Erro ao conectar ao MongoDB:",
            error.message
        );

        process.exit(1);
    }
}

export default connectDatabase;