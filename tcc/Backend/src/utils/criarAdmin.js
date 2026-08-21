import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

export async function criarAdmin() {
  try {
    const emailAdmin = "admin@adotapet.com";
    const senhaAdmin = "admin123";

    // Criptografa a senha garantindo o hash correto
    const senhaCriptografada = await bcrypt.hash(senhaAdmin, 10);

    // Atualiza o admin existente ou cria um novo se não existir
    await Usuario.findOneAndUpdate(
      { $or: [{ tipo: "admin" }, { email: emailAdmin }] },
      {
        $set: {
          nome: "Administrador",
          email: emailAdmin,
          cpf: "00000000000",
          telefone: "00999999999",
          endereco: "Sistema AdotaPet",
          senha: senhaCriptografada,
          tipo: "admin"
        }
      },
      { upsert: true, new: true }
    );

    console.log("✅ Administrador atualizado/criado com sucesso com as credenciais padrões!");
  } catch (error) {
    console.error("❌ Erro ao atualizar/criar administrador:", error);
  }
}