import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

import AnimalCard from "../components/AnimalCard";
import "../App.css";

function Animais() {
  const [animais, setAnimais] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/animais")
      .then((res) => {
        setAnimais(res.data);
      })
      .catch((erro) => {
        console.error("ERRO AO BUSCAR ANIMAIS:", erro);
      });
  }, []);

  return (
  <>
    <Navbar />

    <div className="app">

      <h1 className="titulo">
        AdotaPet 🐾
      </h1>

      <p className="subtitulo">
        Encontre um novo amigo para fazer parte da sua família.
      </p>

      <h2>Animais disponíveis</h2>

      {animais.length === 0 ? (
        <p>Nenhum animal cadastrado.</p>
      ) : (
        <div className="lista-animais">

          {animais
            .filter((animal) => animal.disponivel)
            .map((animal) => (
              <AnimalCard
                key={animal._id}
                animal={animal}
              />
            ))}

        </div>
      )}

    </div>
  </>
);

}

export default Animais;