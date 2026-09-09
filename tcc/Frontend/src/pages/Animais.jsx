import React, { useEffect, useState, useContext } from "react";

import Navbar from "../components/Navbar";
import AnimalCard from "../components/AnimalCard";
import { UserContext } from "../context/UserContext";

import api from "../services/api";

import "../App.css";

function Animais() {
  const { usuario } = useContext(UserContext);

  const [animais, setAnimais] = useState([]);
  const [minhasSolicitacoes, setMinhasSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  // Estado para armazenar os critérios do filtro da Navbar
  const [filtros, setFiltros] = useState({
    busca: "",
    especie: "",
    raca: "",
    sexo: "",
    idade: ""
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);

        // 1. Busca todos os animais
        const respostaAnimais = await api.get("/animais");
        setAnimais(respostaAnimais.data);

        // 2. Busca APENAS as solicitações do usuário logado
        const idUsuario = usuario?.id || usuario?._id;
        if (idUsuario) {
          const respostaSolicitacoes = await api.get(`/solicitacoes?usuario=${idUsuario}`);
          setMinhasSolicitacoes(respostaSolicitacoes.data);
        }
      } catch (erro) {
        console.error("ERRO AO CARREGAR DADOS:", erro);
        setMensagem("Não foi possível carregar os animais.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [usuario]);

  // Aplica os filtros sobre os animais que estão disponíveis
  const animaisDisponiveis = animais.filter((animal) => {
    if (!animal.disponivel) return false;

    const atendeBusca = animal.nome
      ?.toLowerCase()
      .includes((filtros.busca || "").toLowerCase());

    const atendeEspecie = filtros.especie
      ? animal.especie?.toLowerCase() === filtros.especie.toLowerCase()
      : true;

    const atendeRaca = filtros.raca
      ? animal.raca?.toLowerCase().includes(filtros.raca.toLowerCase())
      : true;

    const atendeSexo = filtros.sexo
      ? animal.sexo?.toLowerCase() === filtros.sexo.toLowerCase()
      : true;

    const atendeIdade = filtros.idade
      ? animal.idade?.toString().toLowerCase().includes(filtros.idade.toLowerCase())
      : true;

    return atendeBusca && atendeEspecie && atendeRaca && atendeSexo && atendeIdade;
  });

  return (
    <>
      <Navbar filtros={filtros} setFiltros={setFiltros} />

      <main className="app">
        <h1
          className="titulo"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          AdotaPet{" "}
          <img
            src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png"
            alt="Patinha"
            style={{ width: "32px", height: "32px" }}
          />
        </h1>

        <p className="subtitulo">
          Encontre um novo amigo para fazer parte da sua família.
        </p>

        <h2>Animais disponíveis</h2>

        {carregando && (
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center"
            }}
          >
            Carregando animais...{" "}
            <img
              src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png"
              alt="Patinha"
              style={{ width: "20px", height: "20px" }}
            />
          </p>
        )}

        {!carregando && mensagem && <p>{mensagem}</p>}

        {!carregando &&
          !mensagem &&
          animaisDisponiveis.length === 0 && (
            <p>Nenhum animal encontrado com os filtros selecionados.</p>
          )}

        {!carregando && animaisDisponiveis.length > 0 && (
          <div className="lista-animais">
            {animaisDisponiveis.map((animal) => {
              // Verifica se O USUÁRIO LOGADO tem solicitação ativa para ESTE animal
              const jaSolicitou = minhasSolicitacoes.some((s) => {
                const idAnimalSol = s.animal?._id || s.animal;
                return idAnimalSol === animal._id && s.status !== "cancelada";
              });

              return (
                <AnimalCard
                  key={animal._id}
                  animal={animal}
                  jaSolicitou={jaSolicitou}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default Animais;