import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Cadastro() {

  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
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
          email,
          telefone,
          endereco,
          senha
        }
      );


      console.log(
        "CADASTRO:",
        resposta.data
      );


      setMensagem(
        "Cadastro realizado com sucesso! "
      );


      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (erro) {

      console.error(
        "ERRO AO CADASTRAR:",
        erro
      );


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

    <div className="auth-container">

      <div className="auth-card">

        <h1>
          AdotaPet <img 
                            src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                            alt="Patinha" 
                            style={{ width: "20px", height: "20px" }} 
                        />
        </h1>

        <h2>
          Criar conta
        </h2>


        <form onSubmit={cadastrar}>


          <div>

            <label>
              Nome
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              placeholder="Digite seu nome"
              required
            />

          </div>


          <div>

            <label>
              CPF
            </label>

            <input
              type="text"
              value={cpf}
              onChange={(e) =>
                setCpf(e.target.value)
              }
              placeholder="Digite seu CPF"
              required
            />

          </div>


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
              Telefone
            </label>

            <input
              type="text"
              value={telefone}
              onChange={(e) =>
                setTelefone(e.target.value)
              }
              placeholder="Digite seu telefone"
              required
            />

          </div>


          <div>

            <label>
              Endereço
            </label>

            <input
              type="text"
              value={endereco}
              onChange={(e) =>
                setEndereco(e.target.value)
              }
              placeholder="Digite seu endereço"
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
            Criar minha conta 
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

          Já possui uma conta?{" "}

          <Link to="/login">
            Entrar
          </Link>

        </p>


      </div>

    </div>

  );
}

export default Cadastro;