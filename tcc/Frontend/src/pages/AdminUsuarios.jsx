import React, { useEffect, useState } from "react";
import api from "../services/api";

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    
    // Estado para controlar o modal de solicitações do usuário selecionado
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [carregandoSolicitacoes, setCarregandoSolicitacoes] = useState(false);

    // Buscar lista de usuários
    async function carregarUsuarios() {
        try {
            setCarregando(true);
            const resposta = await api.get("/usuarios");
            setUsuarios(Array.isArray(resposta.data) ? resposta.data : resposta.data.usuarios || []);
        } catch (error) {
            console.error("ERRO AO BUSCAR USUÁRIOS:", error);
            setErro("Não foi possível carregar a lista de usuários.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    // Excluir usuário
    async function handleExcluir(id, nome) {
        if (!window.confirm(`Tem certeza que deseja excluir o usuário ${nome}?`)) return;

        try {
            await api.delete(`/usuarios/${id}`);
            setUsuarios((lista) => lista.filter((user) => (user._id || user.id) !== id));
            alert("Usuário excluído com sucesso!");
        } catch (error) {
            console.error("ERRO AO EXCLUIR USUÁRIO:", error);
            alert(error.response?.data?.mensagem || "Erro ao excluir usuário.");
        }
    }

    // Buscar solicitações/adoções do usuário específico
    async function handleVerSolicitacoes(usuario) {
        setUsuarioSelecionado(usuario);
        setCarregandoSolicitacoes(true);
        const userId = usuario._id || usuario.id;

        try {
            // Tenta buscar no endpoint de solicitações filtrado por usuário
            const resposta = await api.get(`/solicitacoes?usuarioId=${userId}`);
            const lista = Array.isArray(resposta.data) ? resposta.data : resposta.data.solicitacoes || [];
            
            // Filtra manualmente caso o backend devolva a lista completa
            const filtradas = lista.filter(s => (s.usuario?._id || s.usuario?.id || s.usuarioId || s.usuario) === userId);
            setSolicitacoes(filtradas.length > 0 ? filtradas : lista);
        } catch (error) {
            console.error("ERRO AO BUSCAR SOLICITAÇÕES:", error);
            setSolicitacoes([]);
        } finally {
            setCarregandoSolicitacoes(false);
        }
    }

    return (
        <section className="secao-admin-usuarios">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Gerenciar Usuários 👥</h2>
            </div>

            {carregando && <p>Carregando usuários...</p>}
            {erro && <p style={{ color: "red" }}>{erro}</p>}

            {!carregando && !erro && usuarios.length === 0 && (
                <p>Nenhum usuário cadastrado.</p>
            )}

            {!carregando && usuarios.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {usuarios.map((user) => {
                        const id = user._id || user.id;

                        return (
                            <div
                                key={id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "15px 20px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    backgroundColor: "#fff",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                }}
                            >
                                {/* Informações Cadastradas */}
                                <div>
                                    <h3 style={{ margin: "0 0 5px 0", color: "#2e7d32", fontSize: "1.2rem" }}>
                                        {user.nome || user.name || "Sem Nome"}
                                    </h3>
                                    <p style={{ margin: "3px 0" }}><strong>E-mail:</strong> {user.email}</p>
                                    <p style={{ margin: "3px 0" }}><strong>Telefone/WhatsApp:</strong> {user.telefone || user.celular || "Não informado"}</p>
                                    <p style={{ margin: "3px 0" }}><strong>Tipo:</strong> {user.isAdmin || user.tipo === "admin" ? "Administrador 🔑" : "Usuário Comum 👤"}</p>
                                </div>

                                {/* Opções/Ações */}
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleVerSolicitacoes(user)}
                                        style={{
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                            border: "none",
                                            padding: "8px 14px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        📋 Ver Solicitações
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleExcluir(id, user.nome || user.email)}
                                        style={{
                                            backgroundColor: "#d32f2f",
                                            color: "#fff",
                                            border: "none",
                                            padding: "8px 14px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        🗑️ Excluir
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL / SEÇÃO DE SOLICITAÇÕES DO USUÁRIO SELECIONADO */}
            {usuarioSelecionado && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "#fff",
                        padding: "25px",
                        borderRadius: "10px",
                        maxWidth: "600px",
                        width: "90%",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                            <h3>Solicitações de: <span style={{ color: "#2e7d32" }}>{usuarioSelecionado.nome || usuarioSelecionado.email}</span></h3>
                            <button 
                                onClick={() => setUsuarioSelecionado(null)}
                                style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", fontWeight: "bold" }}
                            >
                                ❌
                            </button>
                        </div>

                        {carregandoSolicitacoes && <p>Carregando solicitações...</p>}

                        {!carregandoSolicitacoes && solicitacoes.length === 0 && (
                            <p style={{ color: "#666" }}>Este usuário não possui nenhuma solicitação de adoção registrada.</p>
                        )}

                        {!carregandoSolicitacoes && solicitacoes.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {solicitacoes.map((sol) => (
                                    <div key={sol._id || sol.id} style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "6px", backgroundColor: "#f9f9f9" }}>
                                        <p style={{ margin: "2px 0" }}><strong>Animal:</strong> {sol.animal?.nome || sol.nomeAnimal || "N/A"}</p>
                                        <p style={{ margin: "2px 0" }}><strong>Status:</strong> {sol.status || "Pendente"}</p>
                                        {sol.createdAt && (
                                            <p style={{ margin: "2px 0", fontSize: "0.85rem", color: "#666" }}>
                                                <strong>Data:</strong> {new Date(sol.createdAt).toLocaleDateString("pt-BR")}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setUsuarioSelecionado(null)}
                            style={{ marginTop: "20px", width: "100%", padding: "10px", backgroundColor: "#666", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminUsuarios;