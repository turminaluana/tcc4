import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import api from "../services/api";

function SolicitarAdocao() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { usuario } = useContext(UserContext);

    const [mensagem, setMensagem] = useState("");
    const [mensagemSistema, setMensagemSistema] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);


    async function enviarSolicitacao(e) {

        e.preventDefault();

        setErro("");
        setMensagemSistema("");
        setCarregando(true);

        try {

            const resposta =
                await api.post("/solicitacoes", {
                    usuario: usuario.id,
                    animal: id,
                    mensagem
                });

            console.log(
                "SOLICITAÇÃO:",
                resposta.data
            );

            setMensagemSistema(
                "Solicitação enviada com sucesso!"
            );

            setTimeout(() => {
                navigate("/minhas-solicitacoes");
            }, 1200);

        } catch (error) {

            console.error(
                "ERRO AO SOLICITAR:",
                error
            );

            setErro(
                error.response?.data?.mensagem ||
                "Erro ao enviar solicitação."
            );

        } finally {

            setCarregando(false);

        }
    }


    return (
        <>
            <Navbar />

            <main className="solicitar-page">

                <div className="solicitar-card">

                    <div className="solicitar-icon" style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                            alt="Patinha" 
                            style={{ width: "45px", height: "45px" }} 
                        />
                    </div>

                    <h1>
                        Quero adotar!
                    </h1>

                    <p className="solicitar-subtitulo">
                        Que legal que você quer dar um novo
                        lar para este animal!
                    </p>


                    {usuario && (

                        <div className="usuario-solicitacao">

                            <span>
                                Solicitação feita por
                            </span>

                            <strong>
                                {usuario.nome}
                            </strong>

                        </div>

                    )}


                    <form onSubmit={enviarSolicitacao} style={{ display: "flex", flexDirection: "column", width: "100%" }}>

                        <label htmlFor="mensagem-adocao" style={{ textAlign: "left", marginBottom: "8px", fontWeight: "bold" }}>
                            Por que você gostaria de adotar este animal?
                        </label>

                        <textarea
                            id="mensagem-adocao"
                            value={mensagem}
                            onChange={(e) =>
                                setMensagem(
                                    e.target.value
                                )
                            }
                            placeholder="Conte um pouco sobre você e sobre o lar que pretende oferecer..."
                            rows="5"
                            required
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "1rem",
                                fontFamily: "inherit",
                                resize: "vertical"
                            }}
                        />


                        <p className="dica-solicitacao" style={{ textAlign: "left", fontSize: "0.85rem", color: "#666", marginTop: "8px" }}>
                            Conte um pouco sobre o espaço disponível, sua rotina e como pretende cuidar do seu novo amigo.
                        </p>


                        {mensagemSistema && (

                            <p className="mensagem-sucesso" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                {mensagemSistema}
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                                    alt="Patinha" 
                                    style={{ width: "18px", height: "18px" }} 
                                />
                            </p>

                        )}


                        {erro && (

                            <p className="mensagem-erro">
                                {erro}
                            </p>

                        )}


                        <div className="solicitar-acoes" style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>

                            <button
                                type="button"
                                className="botao-voltar"
                                onClick={() =>
                                    navigate("/animais")
                                }
                            >
                                ← Voltar
                            </button>


                            <button
                                type="submit"
                                disabled={carregando}
                                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                            >
                                {carregando ? (
                                    "Enviando..."
                                ) : (
                                    <>
                                        Enviar solicitação
                                    </>
                                )}
                            </button>

                        </div>

                    </form>

                </div>

            </main>
        </>
    );
}

export default SolicitarAdocao;