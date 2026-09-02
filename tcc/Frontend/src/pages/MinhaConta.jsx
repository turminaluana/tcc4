import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./MinhaConta.css";

function MinhaConta() {
  const { usuario, setUsuario } = useContext(UserContext);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    endereco: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || "",
        cpf: usuario.cpf || "",
        telefone: usuario.telefone || "",
        endereco: usuario.endereco || "",
        novaSenha: "",
        confirmarSenha: "",
      });
    }
  }, [usuario]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: "", texto: "" });

    const userId = usuario?.id || usuario?._id;

    if (!userId) {
      setMensagem({
        tipo: "erro",
        texto: "ID do usuário não foi encontrado. Faça login novamente.",
      });
      setCarregando(false);
      return;
    }

    // Validação de confirmação de senha no frontend
    if (formData.novaSenha) {
      if (formData.novaSenha !== formData.confirmarSenha) {
        setMensagem({
          tipo: "erro",
          texto: "A nova senha e a confirmação não coincidem.",
        });
        setCarregando(false);
        return;
      }
    }

    try {
      // Monta os dados a serem enviados (envia a senha apenas se foi preenchida)
      const dadosParaEnviar = {
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        endereco: formData.endereco,
      };

      if (formData.novaSenha) {
        dadosParaEnviar.senha = formData.novaSenha;
      }

      const resposta = await api.put(`/usuarios/${userId}`, dadosParaEnviar);

      const usuarioAtualizado = resposta.data.usuario || resposta.data;

      if (setUsuario) {
        setUsuario(usuarioAtualizado);
      }

      // Limpa os campos de senha após salvar com sucesso
      setFormData((prev) => ({
        ...prev,
        novaSenha: "",
        confirmarSenha: "",
      }));

      setMensagem({
        tipo: "sucesso",
        texto: "Perfil e dados atualizados com sucesso! ",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMensagem({
        tipo: "erro",
        texto:
          error.response?.data?.mensagem ||
          "Não foi possível salvar as alterações.",
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="perfil-container">
        <div className="perfil-card">
          <div className="perfil-header">
            <h1>Minha Conta</h1>
            <p>Gerencie e mantenha seus dados cadastrais e segurança atualizados.</p>
          </div>

          {mensagem.texto && (
            <div className={`mensagem ${mensagem.tipo}`}>
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="perfil-form">
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone / WhatsApp</label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endereco">Endereço</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                placeholder="Rua, Número, Bairro, Cidade"
                required
              />
            </div>

            <div className="secao-senha">
              <h3>Alterar Senha </h3>
              <br />

              <div className="form-group">
                <label htmlFor="novaSenha">Nova Senha</label>
                <input
                  type="password"
                  id="novaSenha"
                  name="novaSenha"
                  value={formData.novaSenha}
                  onChange={handleChange}
                  placeholder="Digite a nova senha"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>

            <div className="perfil-acoes">
              <button
                type="submit"
                className="btn-salvar"
                disabled={carregando}
              >
                {carregando ? "Salvando..." : "Salvar Alterações "}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default MinhaConta;