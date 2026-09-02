import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <section className="secao-admin-animais">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Gerenciar Animais </h2>

                <button 
                    type="button" 
                    onClick={() => navigate("/admin/animais/cadastrar")}
                    style={{ 
                        backgroundColor: "#2e7d32", 
                        color: "#fff", 
                        border: "none", 
                        padding: "10px 16px", 
                        borderRadius: "6px", 
                        fontWeight: "bold", 
                        cursor: "pointer" 
                    }}
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
                                {/* Grupo da Esquerda: Imagem + Informações */}
                                <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
                                    
                                    {/* Container da Imagem */}
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
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.style.display = 'block'; 
                                                    }
                                                }}
                                            />
                                        ) : null}
                                        
                                        {/* Ícone exibido se não houver foto ou se a URL falhar */}
                                        <span style={{ fontSize: "50px", display: temFoto ? "none" : "block" }}>
                                            <img 
                                                src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                                                alt="Pata" 
                                                style={{ width: "50px", height: "50px" }} 
                                                />
                                        </span>
                                    </div>

                                    {/* Textos Informativos */}
                                    <div className="animal-admin-info">
                                        <h3 style={{ margin: "0 0 5px 0", fontSize: "1.3rem" }}>{animal.nome}</h3>
                                        <p style={{ margin: "2px 0" }}><strong>Espécie:</strong> {animal.especie}</p>
                                        <p style={{ margin: "2px 0" }}><strong>Raça:</strong> {animal.raca}</p>
                                        <p style={{ margin: "2px 0" }}><strong>Idade:</strong> {animal.idade}</p>
                                        <p style={{ margin: "2px 0" }}><strong>Sexo:</strong> {animal.sexo}</p>
                                        <p style={{ margin: "2px 0" }}>
                                            <strong>Disponível:</strong>{" "}
                                            {animal.disponivel ? "Sim " : "Não "}
                                        </p>
                                    </div>
                                </div>

                                {/* Grupo da Direita: Botões */}
                                <div className="animal-admin-acoes" style={{ display: "flex", gap: "10px" }}>
                                    <button 
                                        type="button" 
                                        onClick={() => navigate(`/admin/animais/editar/${animal._id}`)}
                                        style={{ padding: "8px 14px", cursor: "pointer" }}
                                    >
                                        Editar
                                    </button>

                                    <button 
                                        type="button" 
                                        onClick={() => excluirAnimal(animal._id)}
                                        style={{ padding: "8px 14px", cursor: "pointer" }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default AdminAnimais;