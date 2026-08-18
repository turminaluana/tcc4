import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";

function Login() {

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  async function fazerLogin(e) {

    e.preventDefault();

    setMensagem("");

    try {

      const resposta = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          cpf: cpf,
          senha: senha
        }
      );

      console.log("LOGIN:", resposta.data);

      login(resposta.data.usuario);

      setMensagem("Login realizado com sucesso! ✅");

      setTimeout(() => {
        navigate("/animais");
      }, 1000);

      console.log("Usuário:", resposta.data);

    } catch (erro) {

      console.error("ERRO LOGIN:", erro);

      if (erro.response) {
        setMensagem(
          erro.response.data.mensagem || "Erro ao fazer login."
        );
      } else {
        setMensagem("Não foi possível conectar ao servidor.");
      }

    }
  }

  return (
    <div>

      <h1>AdotaPet 🐾</h1>

      <h2>Entrar</h2>

      <form onSubmit={fazerLogin}>

        <div>
          <label>CPF</label>

          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite seu CPF"
          />
        </div>

        <br />

        <div>
          <label>Senha</label>

          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        <br />

        <button type="submit">
          Entrar
        </button>

      </form>

      {mensagem && (
        <p>{mensagem}</p>
      )}

    </div>
  );
}

export default Login;