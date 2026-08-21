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
            const resposta = await api.get("/animais");
            setAnimais(Array.isArray(resposta.data) ? resposta.data : []);
        } catch (error) {
            console.error("ERRO AO BUSCAR ANIMAIS:", error);
            setErro("Não foi possível carregar os animais.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarAnimais();
    }, []);

    async function excluirAnimal(id) {
        if (!window.confirm("Tem certeza que deseja excluir este animal?")) return;

        try {
            await api.delete(`/animais/${id}`);
            setAnimais((lista) => lista.filter((animal) => animal._id !== id));
        } catch (error) {
            console.error("ERRO AO EXCLUIR ANIMAL:", error);
            alert(error.response?.data?.mensagem || "Erro ao excluir animal.");
        }
    }

    return (
        <>
            <Navbar />

            <main className="admin" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                <h1>Gerenciar animais 🐾</h1>

                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <button type="button" onClick={() => navigate("/admin")}>
                        ← Voltar para o painel
                    </button>

                    <button 
                        type="button" 
                        onClick={() => navigate("/admin/animais/cadastrar")}
                        style={{ backgroundColor: "#2e7d32", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                    >
                        + Cadastrar animal
                    </button>
                </div>

                {carregando && <p>Carregando animais...</p>}
                {erro && <p style={{ color: "red" }}>{erro}</p>}

                {!carregando && !erro && animais.length === 0 && (
                    <p>Nenhum animal cadastrado.</p>
                )}

                {!carregando && animais.length > 0 && (
                    <div className="lista-admin-animais">
                        {animais.map((animal) => {
                            const temFoto = animal.foto || animal.imagem || animal.urlFoto;

                            return (
                                <div 
                                    className="animal-admin-card" 
                                    key={animal._id} 
                                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}
                                >
                                    {/* Grupo da Esquerda: Imagem + Informações (sem alterar seus textos originais) */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
                                        
                                        {/* Container da Imagem (Maior e com fallback estilo usuário) */}
                                        <div style={{ 
                                            width: "140px", 
                                            height: "140px", 
                                            flexShrink: 0,
                                            backgroundColor: "#f5f5f5", 
                                            borderRadius: "10px", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center", 
                                            overflow: "hidden",
                                            border: "1px solid #ddd"
                                        }}>
                                            {temFoto ? (
                                                <img 
                                                    src={temFoto} 
                                                    alt={animal.nome} 
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={(e) => { 
                                                        e.target.style.display = 'none'; 
                                                        e.target.nextSibling.style.display = 'block'; 
                                                    }}
                                                />
                                            ) : null}
                                            
                                            {/* Ícone exibido se não houver foto ou se a URL falhar */}
                                            <span style={{ fontSize: "50px", display: temFoto ? "none" : "block" }}>🐾</span>
                                        </div>

                                        {/* Seus textos originais */}
                                        <div className="animal-admin-info">
                                            <h2>{animal.nome}</h2>
                                            <p><strong>Espécie:</strong> {animal.especie}</p>
                                            <p><strong>Raça:</strong> {animal.raca}</p>
                                            <p><strong>Idade:</strong> {animal.idade}</p>
                                            <p><strong>Sexo:</strong> {animal.sexo}</p>
                                            <p>
                                                <strong>Disponível:</strong>{" "}
                                                {animal.disponivel ? "Sim ✅" : "Não ❌"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Grupo da Direita: Botões Originais */}
                                    <div className="animal-admin-acoes">
                                        <button type="button" onClick={() => navigate(`/admin/animais/editar/${animal._id}`)}>
                                            ✏️ Editar
                                        </button>

                                        <button type="button" onClick={() => excluirAnimal(animal._id)}>
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </>
    );
}

export default AdminAnimais;