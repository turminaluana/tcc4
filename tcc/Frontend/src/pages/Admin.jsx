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

                // Tratamento flexível para aceitar Array direto ou dentro de um objeto
                const listaAnimais = Array.isArray(respostaAnimais.data) 
                    ? respostaAnimais.data 
                    : respostaAnimais.data?.animais || [];

                const listaUsuarios = Array.isArray(respostaUsuarios.data) 
                    ? respostaUsuarios.data 
                    : respostaUsuarios.data?.usuarios || [];

                const listaSolicitacoes = Array.isArray(respostaSolicitacoes.data) 
                    ? respostaSolicitacoes.data 
                    : respostaSolicitacoes.data?.solicitacoes || [];

                setAnimais(listaAnimais);
                setUsuarios(listaUsuarios);

                // Filtra para não mostrar solicitações canceladas
                const solicitacoesAtivas = listaSolicitacoes.filter(
                    (sol) => sol?.status?.toLowerCase() !== "cancelada" && sol?.status?.toLowerCase() !== "cancelado"
                );

                setSolicitacoes(solicitacoesAtivas);

            } catch (error) {
                console.error("ERRO AO CARREGAR PAINEL:", error);
                setErro("Não foi possível carregar os dados do painel.");
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, []);

    async function atualizarStatus(id, status) {
        try {
            const resposta = await api.put(`/solicitacoes/${id}`, { status });
            const solicitacaoAtualizada = resposta.data.solicitacao || resposta.data;

            setSolicitacoes((lista) =>
                lista.map((sol) =>
                    sol._id === id ? { ...sol, ...solicitacaoAtualizada } : sol
                )
            );
        } catch (error) {
            console.error("ERRO AO ATUALIZAR SOLICITAÇÃO:", error);
            alert(error.response?.data?.mensagem || "Erro ao atualizar solicitação.");
        }
    }

    if (carregando) {
        return (
            <>
                <Navbar />
                <main className="admin">
                    <h1>Painel Administrativo 👑</h1>
                    <p>Carregando dados...</p>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="admin" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                <h1>Painel Administrativo 👑</h1>
                <p>Gerencie o sistema AdotaPet.</p>

                {erro && <p className="erro-msg" style={{ color: "red" }}>{erro}</p>}

                {/* Cards Interativos de Estatísticas */}
                <div 
                    className="admin-cards" 
                    style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                        gap: "15px", 
                        margin: "20px 0 30px 0" 
                    }}
                >
                    {/* Card Animais */}
                    <div 
                        className="admin-card" 
                        onClick={() => navigate("/admin/animais")}
                        style={{ 
                            background: "#fff", 
                            padding: "15px", 
                            borderRadius: "8px", 
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                        }}
                    >
                        <span style={{ fontSize: "2rem" }}>🐾</span>
                        <h3>Animais</h3>
                        <strong>{animais.length}</strong>
                    </div>

                    {/* Card Usuários */}
                    <div 
                        className="admin-card" 
                        onClick={() => navigate("/admin/usuarios")}
                        style={{ 
                            background: "#fff", 
                            padding: "15px", 
                            borderRadius: "8px", 
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                        }}
                    >
                        <span style={{ fontSize: "2rem" }}>👥</span>
                        <h3>Usuários</h3>
                        <strong>{usuarios.length}</strong>
                    </div>

                    {/* Card Solicitações */}
                    <div 
                        className="admin-card" 
                        onClick={() => {
                            const el = document.getElementById("secao-solicitacoes");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        style={{ 
                            background: "#fff", 
                            padding: "15px", 
                            borderRadius: "8px", 
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                        }}
                    >
                        <span style={{ fontSize: "2rem" }}>📋</span>
                        <h3>Solicitações</h3>
                        <strong>{solicitacoes.length}</strong>
                    </div>
                </div>

                <h2 id="secao-solicitacoes">Solicitações de adoção</h2>

                {solicitacoes.length === 0 ? (
                    <p>Nenhuma solicitação encontrada.</p>
                ) : (
                    <div 
                        className="solicitacoes-admin"
                        style={{ 
                            display: "grid", 
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
                            gap: "20px", 
                            marginTop: "15px" 
                        }}
                    >
                        {solicitacoes.map((solicitacao) => {
                            if (!solicitacao) return null;

                            const nomeAnimal = typeof solicitacao.animal === "object" ? solicitacao.animal?.nome : solicitacao.animal;
                            const nomeAdotante = typeof solicitacao.adotante === "object" ? solicitacao.adotante?.nome : solicitacao.adotante;
                            const emailAdotante = typeof solicitacao.adotante === "object" ? solicitacao.adotante?.email : null;
                            const status = (solicitacao.status || "pendente").toLowerCase();

                            return (
                                <div
                                    className="solicitacao-admin-card"
                                    key={solicitacao._id || Math.random()}
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "10px",
                                        padding: "18px",
                                        boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                                                🐾 {nomeAnimal || "Animal"}
                                            </h3>
                                            <span 
                                                className={`status-${status}`}
                                                style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "12px",
                                                    fontSize: "0.8rem",
                                                    fontWeight: "bold",
                                                    backgroundColor: status === "pendente" ? "#fff3cd" : status === "aprovada" ? "#d4edda" : "#f8d7da",
                                                    color: status === "pendente" ? "#856404" : status === "aprovada" ? "#155724" : "#721c24"
                                                }}
                                            >
                                                {solicitacao.status || "Pendente"}
                                            </span>
                                        </div>

                                        <p style={{ margin: "6px 0" }}>
                                            <strong>Adotante:</strong> {nomeAdotante || "Não informado"}
                                        </p>

                                        <p style={{ margin: "6px 0" }}>
                                            <strong>Email:</strong> {emailAdotante || "Não informado"}
                                        </p>

                                        <p style={{ margin: "6px 0" }}>
                                            <strong>Mensagem:</strong> {solicitacao.mensagem || "Sem mensagem"}
                                        </p>
                                    </div>

                                    {status === "pendente" && (
                                        <div className="acoes-solicitacao" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                                            <button
                                                style={{ flex: 1, cursor: "pointer" }}
                                                onClick={() => atualizarStatus(solicitacao._id, "aprovada")}
                                            >
                                                ✅ Aprovar
                                            </button>

                                            <button
                                                style={{ flex: 1, cursor: "pointer" }}
                                                onClick={() => atualizarStatus(solicitacao._id, "recusada")}
                                            >
                                                ❌ Recusar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </>
    );
}

export default Admin;