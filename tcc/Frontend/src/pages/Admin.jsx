import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function Admin() {

    const navigate = useNavigate();

    const [animais, setAnimais] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {

        async function carregarDados() {

            try {

                const [
                    respostaAnimais,
                    respostaUsuarios,
                    respostaSolicitacoes
                ] = await Promise.all([

                    api.get("/animais"),

                    api.get("/usuarios"),

                    api.get("/solicitacoes")

                ]);

                setAnimais(respostaAnimais.data);
                setUsuarios(respostaUsuarios.data);
                setSolicitacoes(respostaSolicitacoes.data);

            } catch (error) {

                console.error(
                    "ERRO AO CARREGAR PAINEL:",
                    error
                );

                setErro(
                    "Não foi possível carregar os dados do painel."
                );

            } finally {

                setCarregando(false);

            }
        }

        carregarDados();

    }, []);


    async function atualizarStatus(
        id,
        status
    ) {

        try {

            const resposta =
                await api.put(
                    `/solicitacoes/${id}`,
                    {
                        status
                    }
                );

            setSolicitacoes((lista) =>
                lista.map((solicitacao) =>
                    solicitacao._id === id
                        ? resposta.data
                        : solicitacao
                )
            );

        } catch (error) {

            console.error(
                "ERRO AO ATUALIZAR SOLICITAÇÃO:",
                error
            );

            alert(
                error.response?.data?.mensagem ||
                "Erro ao atualizar solicitação."
            );
        }
    }


    if (carregando) {

        return (
            <>
                <Navbar />

                <main className="admin">
                    <h1>
                        Painel Administrativo 👑
                    </h1>

                    <p>
                        Carregando dados...
                    </p>
                </main>
            </>
        );
    }


    return (
        <>
            <Navbar />

            <main className="admin">

                <h1>
                    Painel Administrativo 👑
                </h1>

                <p>
                    Gerencie o sistema AdotaPet.
                </p>

                {erro && (
                    <p>
                        {erro}
                    </p>
                )}

                <div className="admin-cards">

                    <div className="admin-card">
                        <h2>
                            🐾
                        </h2>

                        <h3>
                            Animais
                        </h3>

                        <strong>
                            {animais.length}
                        </strong>
                    </div>

                    <div className="admin-card">
                        <h2>
                            👥
                        </h2>

                        <h3>
                            Usuários
                        </h3>

                        <strong>
                            {usuarios.length}
                        </strong>
                    </div>

                    <div className="admin-card">
                        <h2>
                            📋
                        </h2>

                        <h3>
                            Solicitações
                        </h3>

                        <strong>
                            {solicitacoes.length}
                        </strong>
                    </div>

                </div>


                <div className="admin-acoes">

                    <button
                        onClick={() =>
                            navigate("/admin/animais")
                        }
                    >
                        🐶 Gerenciar animais
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/usuarios")
                        }
                    >
                        👥 Ver usuários
                    </button>

                </div>


                <h2>
                    Solicitações de adoção
                </h2>

                {solicitacoes.length === 0 ? (

                    <p>
                        Nenhuma solicitação encontrada.
                    </p>

                ) : (

                    <div className="solicitacoes-admin">

                        {solicitacoes.map(
                            (solicitacao) => (

                                <div
                                    className="solicitacao-admin-card"
                                    key={solicitacao._id}
                                >

                                    <h3>
                                        🐾{" "}
                                        {solicitacao.animal?.nome ||
                                            "Animal"}
                                    </h3>

                                    <p>
                                        <strong>
                                            Adotante:
                                        </strong>{" "}
                                        {solicitacao.adotante?.nome ||
                                            "Não informado"}
                                    </p>

                                    <p>
                                        <strong>
                                            Email:
                                        </strong>{" "}
                                        {solicitacao.adotante?.email ||
                                            "Não informado"}
                                    </p>

                                    <p>
                                        <strong>
                                            Mensagem:
                                        </strong>{" "}
                                        {solicitacao.mensagem ||
                                            "Sem mensagem"}
                                    </p>

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}
                                        {solicitacao.status}
                                    </p>


                                    {solicitacao.status === "Pendente" && (

                                        <div>

                                            <button
                                                onClick={() =>
                                                    atualizarStatus(
                                                        solicitacao._id,
                                                        "Aprovada"
                                                    )
                                                }
                                            >
                                                ✅ Aprovar
                                            </button>

                                            <button
                                                onClick={() =>
                                                    atualizarStatus(
                                                        solicitacao._id,
                                                        "Recusada"
                                                    )
                                                }
                                            >
                                                ❌ Recusar
                                            </button>

                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </main>
        </>
    );
}

export default Admin;