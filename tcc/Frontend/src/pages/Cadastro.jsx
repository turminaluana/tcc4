import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [senha, setSenha] = useState("");

  const [mensagem, setMensagem] = useState("");

  async function cadastrar(e) {
    e.preventDefault();

    setMensagem("");

    try {
      const resposta = await axios.post(
        "http://localhost:3000/api/usuarios",
        {
          nome,
          cpf,
          telefone,
          endereco,
          senha
        }
      );

      console.log("CADASTRO:", resposta.data);

      setMensagem("Cadastro realizado com sucesso! ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (erro) {
      console.error("ERRO AO CADASTRAR:", erro);

      if (erro.response) {
        setMensagem(
          erro.response.data.mensagem ||
          "Erro ao realizar cadastro."
        );
      } else {
        setMensagem(
          "Não foi possível conectar ao servidor."
        );
      }
    }
  }

  return (
    <div>

      <h1>AdotaPet 🐾</h1>

      <h2>Criar conta</h2>

      <form onSubmit={cadastrar}>

        <div>
          <label>Nome</label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            required
          />
        </div>

        <br />

        <div>
          <label>CPF</label>

          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite seu CPF"
            required
          />
        </div>

        <br />

        <div>
          <label>Telefone</label>

          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Digite seu telefone"
            required
          />
        </div>

        <br />

        <div>
          <label>Endereço</label>

          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Digite seu endereço"
            required
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
            required
          />
        </div>

        <br />

        <button type="submit">
          Cadastrar
        </button>

      </form>

      {mensagem && (
        <p>{mensagem}</p>
      )}

      <p>
        Já possui uma conta?{" "}
        <Link to="/login">
          Entrar
        </Link>
      </p>

    </div>
  );
}

export default Cadastro;