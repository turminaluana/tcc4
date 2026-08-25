import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function CadastrarAnimal() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [especie, setEspecie] = useState("Cachorro");
    const [raca, setRaca] = useState("");
    const [idade, setIdade] = useState("");
    const [sexo, setSexo] = useState("Macho");
    const [descricao, setDescricao] = useState("");
    const [foto, setFoto] = useState("");
    const [disponivel, setDisponivel] = useState(true);

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    async function handleCadastrar(e) {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        const sexoFormatado = sexo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const especieFormatada = especie.toLowerCase();
        const urlImagem = foto.trim();

        // Envia apelidos para imagem (foto, imagem, urlFoto) para bater com qualquer schema do backend
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
            await api.post("/animais", payload);
            alert("Animal cadastrado com sucesso!");
            
            // 🟢 Redireciona diretamente para o Painel do Administrador
            navigate("/admin");
        } catch (error) {
            console.error("ERRO COMPLETO DO AXIOS:", error);
            
            const mensagemErro = 
                error.response?.data?.detalhes || 
                error.response?.data?.error || 
                error.response?.data?.mensagem || 
                error.message || 
                "Erro interno no servidor ao cadastrar animal.";

            setErro(mensagemErro);
        } finally {
            setCarregando(false);
        }
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
                    <h1 className="titulo-form">🐾 Cadastrar Animal</h1>

                    {erro && <div className="mensagem-erro">{erro}</div>}

                    <form onSubmit={handleCadastrar}>
                        <div className="campo-grupo">
                            <label>Nome do Animal *</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Rex"
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
                                    placeholder="Ex: Vira-lata"
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
                                    placeholder="Ex: 2 anos"
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
                                placeholder="https://exemplo.com/foto.jpg"
                                value={foto}
                                onChange={(e) => setFoto(e.target.value)}
                            />
                        </div>

                        <div className="campo-grupo">
                            <label>Descrição / História (opcional)</label>
                            <textarea
                                rows="3"
                                placeholder="Descrição do animal..."
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
                                disabled={carregando}
                            >
                                {carregando ? "Cadastrando..." : "Cadastrar"}
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

export default CadastrarAnimal;