import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminAnimais() {

    const navigate = useNavigate();

    const [animais, setAnimais] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function carregarAnimais() {

        try {

            setCarregando(true);

            const resposta =
                await api.get("/animais");

            setAnimais(resposta.data);

        } catch (error) {

            console.error(
                "ERRO AO BUSCAR ANIMAIS:",
                error
            );

            setErro(
                "Não foi possível carregar os animais."
            );

        } finally {

            setCarregando(false);

        }
    }


    useEffect(() => {

        carregarAnimais();

    }, []);


    async function excluirAnimal(id) {

        const confirmar =
            window.confirm(
                "Tem certeza que deseja excluir este animal?"
            );

        if (!confirmar) {
            return;
        }

        try {

            await api.delete(
                `/animais/${id}`
            );

            setAnimais((lista) =>
                lista.filter(
                    (animal) =>
                        animal._id !== id
                )
            );

        } catch (error) {

            console.error(
                "ERRO AO EXCLUIR ANIMAL:",
                error
            );

            alert(
                error.response?.data?.mensagem ||
                "Erro ao excluir animal."
            );
        }
    }


    return (
        <>
            <Navbar />

            <main className="admin">

                <h1>
                    Gerenciar animais 🐾
                </h1>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    ← Voltar para o painel
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/animais/cadastrar")
                    }
                >
                    + Cadastrar animal
                </button>


                {carregando && (
                    <p>
                        Carregando animais...
                    </p>
                )}


                {erro && (
                    <p>
                        {erro}
                    </p>
                )}


                {!carregando &&
                    !erro &&
                    animais.length === 0 && (

                        <p>
                            Nenhum animal cadastrado.
                        </p>
                    )}


                {!carregando &&
                    animais.length > 0 && (

                        <div className="lista-admin-animais">

                            {animais.map(
                                (animal) => (

                                    <div
                                        className="animal-admin-card"
                                        key={animal._id}
                                    >

                                        <div className="animal-admin-info">

                                            <h2>
                                                {animal.nome}
                                            </h2>

                                            <p>
                                                <strong>
                                                    Espécie:
                                                </strong>{" "}
                                                {animal.especie}
                                            </p>

                                            <p>
                                                <strong>
                                                    Raça:
                                                </strong>{" "}
                                                {animal.raca}
                                            </p>

                                            <p>
                                                <strong>
                                                    Idade:
                                                </strong>{" "}
                                                {animal.idade}
                                            </p>

                                            <p>
                                                <strong>
                                                    Sexo:
                                                </strong>{" "}
                                                {animal.sexo}
                                            </p>

                                            <p>
                                                <strong>
                                                    Disponível:
                                                </strong>{" "}
                                                {animal.disponivel
                                                    ? "Sim ✅"
                                                    : "Não ❌"}
                                            </p>

                                        </div>


                                        <div className="animal-admin-acoes">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/animais/editar/${animal._id}`
                                                    )
                                                }
                                            >
                                                ✏️ Editar
                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    excluirAnimal(
                                                        animal._id
                                                    )
                                                }
                                            >
                                                🗑️ Excluir
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>
                    )}

            </main>
        </>
    );
}

export default AdminAnimais;