import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import AnimalCard from "../components/AnimalCard";

import api from "../services/api";

import "../App.css";

function Animais() {

    const [animais, setAnimais] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {

        async function buscarAnimais() {

            try {

                const resposta =
                    await api.get("/animais");

                setAnimais(resposta.data);

            } catch (erro) {

                console.error(
                    "ERRO AO BUSCAR ANIMAIS:",
                    erro
                );

                setMensagem(
                    "Não foi possível carregar os animais."
                );

            } finally {

                setCarregando(false);

            }
        }

        buscarAnimais();

    }, []);

    const animaisDisponiveis =
        animais.filter(
            (animal) => animal.disponivel
        );

    return (
        <>
            <Navbar />

            <main className="app">

                <h1 className="titulo" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    AdotaPet 
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                        alt="Patinha" 
                        style={{ width: "32px", height: "32px" }} 
                    />
                </h1>

                <p className="subtitulo">
                    Encontre um novo amigo para fazer
                    parte da sua família.
                </p>

                <h2>
                    Animais disponíveis
                </h2>

                {carregando && (
                    <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        Carregando animais... 
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                            alt="Patinha" 
                            style={{ width: "20px", height: "20px" }} 
                        />
                    </p>
                )}

                {!carregando && mensagem && (
                    <p>
                        {mensagem}
                    </p>
                )}

                {!carregando &&
                    !mensagem &&
                    animaisDisponiveis.length === 0 && (
                        <p>
                            Nenhum animal disponível no momento.
                        </p>
                    )}

                {!carregando &&
                    animaisDisponiveis.length > 0 && (

                    <div className="lista-animais">

                        {animaisDisponiveis.map(
                            (animal) => (

                                <AnimalCard
                                    key={animal._id}
                                    animal={animal}
                                />

                            )
                        )}

                    </div>
                )}

            </main>
        </>
    );
}

export default Animais;