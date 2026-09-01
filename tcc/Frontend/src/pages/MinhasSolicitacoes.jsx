import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import api from "../services/api";

function MinhasSolicitacoes() {
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        const resposta = await api.get("/solicitacoes");
        // Oculta solicitações com status "cancelada"
        const ativas = resposta.data.filter(
          (sol) => sol.status !== "cancelada"
        );
        setSolicitacoes(ativas);
      } catch (error) {
        console.error("ERRO AO BUSCAR SOLICITAÇÕES:", error);
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível carregar suas solicitações."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (usuario) {
      carregarSolicitacoes();
    }
  }, [usuario]);

  // Função para chamar a API e cancelar
  async function handleCancelarSolicitacao(id) {
    const confirmou = window.confirm(
      "Tem certeza que deseja cancelar esta solicitação?"
    );
    if (!confirmou) return;

    try {
      await api.patch(`/solicitacoes/${id}/cancelar`);

      // Remove imediatamente a solicitação cancelada da lista na tela
      setSolicitacoes((prev) => prev.filter((sol) => sol._id !== id));
    } catch (error) {
      alert(
        error.response?.data?.mensagem || "Erro ao cancelar a solicitação."
      );
    }
  }

  function classeStatus(status) {
    if (status === "aprovada") return "status-aprovada";
    if (status === "recusada") return "status-recusada";
    return "status-pendente";
  }

  function textoStatus(status) {
    if (status === "aprovada") return "Aprovada ";
    if (status === "recusada") return "Recusada ";
    return "Pendente ";
  }

  return (
    <>
      <Navbar />

      <main className="solicitacoes-page">
        <div className="solicitacoes-header">
          <div>
            <h1>Minhas solicitações <img src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                alt="Patinha" 
                style={{ width: "20px", height: "20px" }} 
              /></h1>
                    
            <p>Acompanhe o andamento dos seus pedidos de adoção.</p>
          </div>

          <button onClick={() => navigate("/animais")}>← Ver animais</button>
        </div>

        {carregando && (
          <div className="solicitacoes-vazia">
            <span>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                alt="Patinha" 
                style={{ width: "20px", height: "20px" }} 
                />
            </span>
            <p>Carregando suas solicitações...</p>
          </div>
        )}

        {erro && <div className="mensagem-erro">{erro}</div>}

        {!carregando && !erro && solicitacoes.length === 0 && (
          <div className="solicitacoes-vazia">
            <span></span>
            <h2>Você ainda não fez nenhuma solicitação.</h2>
            <p>Encontre um novo amigo e faça uma solicitação de adoção!</p>

            <button onClick={() => navigate("/animais")}>
              Encontrar um pet <img 
                            src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                            alt="Patinha" 
                            style={{ width: "20px", height: "20px" }} 
                        />
            </button>
          </div>
        )}

        {!carregando && solicitacoes.length > 0 && (
          <div className="solicitacoes-lista">
            {solicitacoes.map((solicitacao) => (
              <div className="solicitacao-card" key={solicitacao._id}>
                <div className="solicitacao-pet">
                  <div className="solicitacao-pet-foto">
                    {solicitacao.animal?.imagem ? (
                      <img
                        src={solicitacao.animal.imagem}
                        alt={solicitacao.animal.nome}
                      />
                    ) : (
                      <span>
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                            alt="Patinha" 
                            style={{ width: "20px", height: "20px" }} 
                        />
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="solicitacao-label">Pet</span>
                    <h2>{solicitacao.animal?.nome || "Animal"}</h2>
                    <p>
                      {solicitacao.animal?.especie} • {solicitacao.animal?.raca}
                    </p>
                  </div>
                </div>

                <div className="solicitacao-detalhes">
                  <div>
                    <span>Status</span>
                    <strong className={classeStatus(solicitacao.status)}>
                      {textoStatus(solicitacao.status)}
                    </strong>
                  </div>

                  <div>
                    <span>Data da solicitação</span>
                    <strong>
                      {new Date(solicitacao.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </strong>
                  </div>
                </div>

                {solicitacao.mensagem && (
                  <div className="solicitacao-mensagem">
                    <span>Sua mensagem</span>
                    <p>"{solicitacao.mensagem}"</p>
                  </div>
                )}

                {solicitacao.status === "pendente" && (
                  <div className="solicitacao-acoes">
                    <button
                      className="btn-cancelar"
                      onClick={() =>
                        handleCancelarSolicitacao(solicitacao._id)
                      }
                    >
                      Cancelar solicitação
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default MinhasSolicitacoes;