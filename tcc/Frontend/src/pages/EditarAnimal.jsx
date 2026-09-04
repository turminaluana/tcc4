import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function EditarAnimal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [especie, setEspecie] = useState("Cachorro");
    const [raca, setRaca] = useState("");
    const [idade, setIdade] = useState("");
    const [sexo, setSexo] = useState("Macho");
    const [descricao, setDescricao] = useState("");
    const [foto, setFoto] = useState("");
    const [disponivel, setDisponivel] = useState(true);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    // Busca todos os animais e localiza o animal pelo ID da URL
    useEffect(() => {
        async function carregarAnimal() {
            try {
                setCarregando(true);
                const resposta = await api.get("/animais");
                const lista = Array.isArray(resposta.data) ? resposta.data : resposta.data.animais || [];
                
                // Encontra o animal pelo ID correto (_id ou id)
                const animal = lista.find((item) => item._id === id || item.id === id);

                if (animal) {
                    setNome(animal.nome || "");
                    
                    if (animal.especie) {
                        const esp = animal.especie.toLowerCase();
                        if (esp.includes("gato")) setEspecie("Gato");
                        else if (esp.includes("cachorro") || esp.includes("cao")) setEspecie("Cachorro");
                        else setEspecie("Outro");
                    }
                    
                    setRaca(animal.raca || "");
                    setIdade(animal.idade !== undefined && animal.idade !== null ? String(animal.idade) : "");
                    
                    if (animal.sexo) {
                        const sx = animal.sexo.toLowerCase();
                        setSexo(sx.startsWith("f") ? "Fêmea" : "Macho");
                    }
                    
                    setDescricao(animal.descricao || animal.historia || "");
                    setFoto(animal.foto || animal.imagem || animal.urlFoto || "");
                    setDisponivel(animal.disponivel ?? true);
                } else {
                    setErro("Animal não encontrado na base de dados.");
                }
            } catch (error) {
                console.error("ERRO AO BUSCAR ANIMAIS:", error);
                setErro("Não foi possível carregar as informações do animal.");
            } finally {
                setCarregando(false);
            }
        }

        if (id) {
            carregarAnimal();
        }
    }, [id]);

    async function handleEditar(e) {
        e.preventDefault();
        setErro("");
        setSalvando(true);

        const sexoFormatado = sexo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const especieFormatada = especie.toLowerCase();

        // Mapeia a imagem em múltiplos formatos para o Backend aceitar
        const urlImagem = foto.trim();

        const payload = {
            nome: nome.trim(),
            especie: especieFormatada,
            raca: raca.trim(),
            idade: Number(idade) || idade,
            sexo: sexoFormatado,
            disponivel: Boolean(disponivel),
            foto: urlImagem,
            imagem: urlImagem,
            urlFoto: urlImagem
        };

        if (descricao && descricao.trim()) {
            payload.descricao = descricao.trim();
            payload.historia = descricao.trim();
        }

        try {
            await api.put(`/animais/${id}`, payload);
            alert("Animal atualizado com sucesso!");
            
            //Redireciona de volta para o Painel Principal do Admin
            navigate("/admin");
        } catch (error) {
            console.error("ERRO AO ATUALIZAR ANIMAL:", error.response || error);
            setErro(
                error.response?.data?.mensagem ||
                error.response?.data?.error ||
                "Erro ao atualizar animal."
            );
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <>
                <Navbar />
                <p style={{ padding: "40px", textAlign: "center", fontSize: "18px" }}>
                    Carregando dados do animal... 
                </p>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="container-cadastrar">
                <button
                    type="button"
                    className="btn-voltar"
                    onClick={() => navigate("/admin")}
                >
                    ← Voltar para o painel
                </button>

                <div className="card-formulario">
                    <h1 className="titulo-form"> 
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                            alt="Patinha" 
                            style={{ width: "20px", height: "20px" }} 
                        />
                        Editar Animal</h1>

                    {erro && <div className="mensagem-erro">{erro}</div>}

                    <form onSubmit={handleEditar}>
                        <div className="campo-grupo">
                            <label>Nome do Animal *</label>
                            <input
                                type="text"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div className="grid-2-colunas">
                            <div className="campo-grupo">
                                <label>Espécie *</label>
                                <select
                                    value={especie}
                                    onChange={(e) => setEspecie(e.target.value)}
                                >
                                    <option value="Cachorro">Cachorro</option>
                                    <option value="Gato">Gato</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            <div className="campo-grupo">
                                <label>Raça</label>
                                <input
                                    type="text"
                                    value={raca}
                                    onChange={(e) => setRaca(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid-2-colunas">
                            <div className="campo-grupo">
                                <label>Idade</label>
                                <input
                                    type="text"
                                    value={idade}
                                    onChange={(e) => setIdade(e.target.value)}
                                />
                            </div>

                            <div className="campo-grupo">
                                <label>Sexo</label>
                                <select
                                    value={sexo}
                                    onChange={(e) => setSexo(e.target.value)}
                                >
                                    <option value="Macho">Macho</option>
                                    <option value="Fêmea">Fêmea</option>
                                </select>
                            </div>
                        </div>

                        <div className="campo-grupo">
                            <label>URL da Foto (opcional)</label>
                            <input
                                type="text"
                                value={foto}
                                onChange={(e) => setFoto(e.target.value)}
                            />
                        </div>

                        <div className="campo-grupo">
                            <label>Descrição / História (opcional)</label>
                            <textarea
                                rows="3"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>

                        <div className="campo-checkbox">
                            <input
                                type="checkbox"
                                id="disponivel"
                                checked={disponivel}
                                onChange={(e) => setDisponivel(e.target.checked)}
                            />
                            <label htmlFor="disponivel">Disponível para adoção</label>
                        </div>

                        <div className="botoes-form">
                            <button
                                type="submit"
                                className="btn-salvar"
                                disabled={salvando}
                            >
                                {salvando ? "Salvando..." : "Salvar Alterações"}
                            </button>

                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={() => navigate("/admin")}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default EditarAnimal;