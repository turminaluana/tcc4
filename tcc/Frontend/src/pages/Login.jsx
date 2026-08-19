import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { UserContext } from "../context/UserContext";

function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [mensagem, setMensagem] = useState("");

  const navigate = useNavigate();

  const { login } = useContext(UserContext);


  async function fazerLogin(e) {

    e.preventDefault();

    setMensagem("");


    // ================================
    // ADMINISTRADOR PRÉ-DEFINIDO
    // ================================

    if (
      email.toLowerCase().trim() === "admin@gmail.com" &&
      senha === "123456"
    ) {

      const gerente = {
        id: "1",
        nome: "Administrador",
        email: "admin@gmail.com",
        tipo: "admin"
      };


      console.log(
        "LOGIN ADMIN:",
        gerente
      );


      // Salva o administrador no contexto
      login(gerente);


      setMensagem(
        "Login realizado com sucesso! ✅"
      );


      // Vai para a área administrativa
      setTimeout(() => {

        navigate("/admin");

      }, 800);


      return;
    }


    // ================================
    // LOGIN NORMAL
    // ================================

    try {

      const resposta = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          senha
        }
      );


      console.log(
        "LOGIN:",
        resposta.data
      );


      login(resposta.data.usuario);


      setMensagem(
        "Login realizado com sucesso! ✅"
      );


      setTimeout(() => {

        if (
          resposta.data.usuario.tipo === "admin"
        ) {

          navigate("/admin");

        } else {

          navigate("/animais");

        }

      }, 800);


    } catch (erro) {

      console.error(
        "ERRO LOGIN:",
        erro
      );


      if (erro.response) {

        setMensagem(
          erro.response.data.mensagem ||
          "Erro ao fazer login."
        );

      } else {

        setMensagem(
          "Não foi possível conectar ao servidor."
        );

      }
    }
  }


  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>
          AdotaPet 🐾
        </h1>

        <h2>
          Entrar
        </h2>


        <form onSubmit={fazerLogin}>

          <div>

            <label>
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Digite seu e-mail"
              required
            />

          </div>


          <div>

            <label>
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              placeholder="Digite sua senha"
              required
            />

          </div>


          <button type="submit">
            Entrar 🐾
          </button>

        </form>


        {mensagem && (

          <p
            className={
              mensagem.includes("sucesso")
                ? "mensagem-sucesso"
                : "mensagem-erro"
            }
            style={{ marginTop: "15px" }}
          >
            {mensagem}
          </p>

        )}


        <p className="auth-link">

          Ainda não possui uma conta?{" "}

          <Link to="/cadastro">
            Criar conta
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Login;