import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

// Import das páginas existentes na sua pasta pages
import AdminAnimais from "./AdminAnimais";
import AdminUsuarios from "./AdminUsuarios";

function Admin() {
    // Estado para controlar a aba ativa: 'solicitacoes', 'animais' ou 'usuarios'
    const [abaAtiva, setAbaAtiva] = useState("solicitacoes");

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
                <main className="admin" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h1>Painel Administrativo</h1>
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyGkUaMW-5B0E3OTByG6EjNlkigxNKtpK9VopjGWa7_w&s=10" 
                            alt="Coroa Admin" 
                            style={{ width: "32px", height: "32px" }} 
                        />
                    </div>
                    <p>Carregando dados...</p>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="admin" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h1>Painel Administrativo</h1>
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyGkUaMW-5B0E3OTByG6EjNlkigxNKtpK9VopjGWa7_w&s=10" 
                        alt="Coroa Admin" 
                        style={{ width: "32px", height: "32px" }} 
                    />
                </div>
                <p>Gerencie o sistema AdotaPet.</p>

                {erro && <p className="erro-msg" style={{ color: "red" }}>{erro}</p>}

                {/* CARDS FIXOS DO TOPO */}
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
                        onClick={() => setAbaAtiva("animais")}
                        style={{ 
                            background: "#fff", 
                            padding: "15px", 
                            borderRadius: "8px", 
                            boxShadow: abaAtiva === "animais" ? "0 0 0 2px #2d6a4f" : "0 2px 5px rgba(0,0,0,0.1)", 
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKINx0FVncHQy5Tv9AQfX8kOnFiZ8MgX1DS0PqPSN_IA&s=10" 
                            alt="Ícone Animais" 
                            style={{ width: "40px", height: "40px", marginBottom: "8px" }} 
                        />
                        <h3>Animais</h3>
                        <strong>{animais.length}</strong>
                    </div>

                    {/* Card Usuários */}
                    <div 
                        className="admin-card" 
                        onClick={() => setAbaAtiva("usuarios")}
                        style={{ 
                            background: "#fff", 
                            padding: "15px", 
                            borderRadius: "8px", 
                            boxShadow: abaAtiva === "usuarios" ? "0 0 0 2px #2d6a4f" : "0 2px 5px rgba(0,0,0,0.1)", 
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQto5lBwrmFQzfz9m_ZMQag3JFP7C4yKk-veVUC4eqfow&s=10" 
                            alt="Ícone Usuários" 
                            style={{ width: "40px", height: "40px", marginBottom: "8px" }} 
                        />
                        <h3>Usuários</h3>
                        <strong>{usuarios.length}</strong>
                    </div>

                    {/* Card Solicitações */}
                    <div 
                        className="admin-card" 
                        onClick={() => setAbaAtiva("solicitacoes")}
                        style={{ 
                            background: "#fff", 
                            padding: "15px", 
                            borderRadius: "8px", 
                            boxShadow: abaAtiva === "solicitacoes" ? "0 0 0 2px #2d6a4f" : "0 2px 5px rgba(0,0,0,0.1)", 
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr4EzvlsmnPYU6MY7xPAHL2dcytqsmVT-8OtbAt_IeQ&s=10" 
                            alt="Ícone Solicitações" 
                            style={{ width: "40px", height: "40px", marginBottom: "8px" }} 
                        />
                        <h3>Solicitações</h3>
                        <strong>{solicitacoes.length}</strong>
                    </div>
                </div>

                {/* CONTEÚDO DINÂMICO */}
                <div className="conteudo-aba">
                    {abaAtiva === "animais" && <AdminAnimais />}
                    
                    {abaAtiva === "usuarios" && <AdminUsuarios />}

                    {abaAtiva === "solicitacoes" && (
                        <div>
                            <h2>Solicitações de adoção</h2>

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

                                        const adotanteObj = solicitacao.adotante || solicitacao.usuario || {};

                                        const nomeAnimal = typeof solicitacao.animal === "object" ? solicitacao.animal?.nome : solicitacao.animal;
                                        
                                        // Verifica se o animal já está indisponível/adotado
                                        const animalJaAdotado = typeof solicitacao.animal === "object" && solicitacao.animal?.disponivel === false;

                                        const nomeAdotante = 
                                            (typeof solicitacao.adotante === "string" ? solicitacao.adotante : null) || 
                                            adotanteObj.nome || 
                                            solicitacao.nomeAdotante || 
                                            solicitacao.nome;

                                        const emailAdotante = 
                                            adotanteObj.email || 
                                            solicitacao.emailAdotante || 
                                            solicitacao.email;

                                        const telefoneAdotante = 
                                            adotanteObj.telefone || 
                                            adotanteObj.celular || 
                                            solicitacao.telefoneAdotante || 
                                            solicitacao.telefone || 
                                            solicitacao.contato;

                                        const enderecoAdotante = 
                                            adotanteObj.endereco || 
                                            solicitacao.enderecoAdotante || 
                                            solicitacao.endereco;

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
                                                        <h3 style={{ margin: 0, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <img 
                                                                src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                                                                alt="Pata" 
                                                                style={{ width: "20px", height: "20px" }} 
                                                            />
                                                            {nomeAnimal || "Animal"}
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

                                                    {/* ALERTA DE ANIMAL JÁ ADOTADO */}
                                                    {animalJaAdotado && status !== "aprovada" && (
                                                        <div style={{
                                                            backgroundColor: "#ffebee",
                                                            color: "#c62828",
                                                            padding: "8px 12px",
                                                            borderRadius: "6px",
                                                            marginBottom: "12px",
                                                            fontSize: "0.85rem",
                                                            fontWeight: "bold",
                                                            border: "1px solid #ef9a9a"
                                                        }}>
                                                            ⚠️ Este animal já foi adotado por outra pessoa.
                                                        </div>
                                                    )}

                                                    <p style={{ margin: "6px 0" }}>
                                                        <strong>Adotante:</strong> {nomeAdotante || "Não informado"}
                                                    </p>

                                                    <p style={{ margin: "6px 0" }}>
                                                        <strong>Email:</strong> {emailAdotante || "Não informado"}
                                                    </p>

                                                    <p style={{ margin: "6px 0" }}>
                                                        <strong>Telefone:</strong> {telefoneAdotante || "Não informado"}
                                                    </p>

                                                    <p style={{ margin: "6px 0" }}>
                                                        <strong>Endereço:</strong> {enderecoAdotante || "Não informado"}
                                                    </p>

                                                    <p style={{ margin: "6px 0" }}>
                                                        <strong>Mensagem:</strong> {solicitacao.mensagem || "Sem mensagem"}
                                                    </p>
                                                </div>

                                                {status === "pendente" && (
                                                    <div className="acoes-solicitacao" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                                                        <button
                                                            disabled={animalJaAdotado}
                                                            style={{ 
                                                                flex: 1, 
                                                                cursor: animalJaAdotado ? "not-allowed" : "pointer", 
                                                                display: "flex", 
                                                                alignItems: "center", 
                                                                justifyContent: "center", 
                                                                gap: "6px",
                                                                padding: "8px",
                                                                borderRadius: "6px",
                                                                border: animalJaAdotado ? "1px solid #ccc" : "1px solid #28a745",
                                                                backgroundColor: animalJaAdotado ? "#ccc" : "#28a745",
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                                opacity: animalJaAdotado ? 0.7 : 1
                                                            }}
                                                            onClick={() => atualizarStatus(solicitacao._id, "aprovada")}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                            Aprovar
                                                        </button>

                                                        <button
                                                            style={{ 
                                                                flex: 1, 
                                                                cursor: "pointer", 
                                                                display: "flex", 
                                                                alignItems: "center", 
                                                                justifyContent: "center", 
                                                                gap: "6px",
                                                                padding: "8px",
                                                                borderRadius: "6px",
                                                                border: "1px solid #dc3545",
                                                                backgroundColor: "#dc3545",
                                                                color: "#fff",
                                                                fontWeight: "bold"
                                                            }}
                                                            onClick={() => atualizarStatus(solicitacao._id, "recusada")}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                            </svg>
                                                            Recusar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default Admin;