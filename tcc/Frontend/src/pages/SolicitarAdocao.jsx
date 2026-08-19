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
                "Solicitação enviada com sucesso! 🐾"
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

                    <div className="solicitar-icon">
                        🐾
                    </div>

                    <h1>
                        Quero adotar!
                    </h1>

                    <p className="solicitar-subtitulo">
                        Que legal que você quer dar um novo
                        lar para este animal! ❤️
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


                    <form onSubmit={enviarSolicitacao}>

                        <label>
                            Por que você gostaria de
                            adotar este animal?
                        </label>

                        <textarea
                            value={mensagem}
                            onChange={(e) =>
                                setMensagem(
                                    e.target.value
                                )
                            }
                            placeholder="Conte um pouco sobre você e sobre o lar que pretende oferecer..."
                            rows="7"
                            required
                        />


                        <p className="dica-solicitacao">
                            💡 Conte um pouco sobre o espaço
                            disponível, sua rotina e como
                            pretende cuidar do seu novo amigo.
                        </p>


                        {mensagemSistema && (

                            <p className="mensagem-sucesso">
                                {mensagemSistema}
                            </p>

                        )}


                        {erro && (

                            <p className="mensagem-erro">
                                {erro}
                            </p>

                        )}


                        <div className="solicitar-acoes">

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
                            >
                                {carregando
                                    ? "Enviando..."
                                    : "Enviar solicitação 🐾"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>
        </>
    );
}

export default SolicitarAdocao;