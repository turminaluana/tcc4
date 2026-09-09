import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api";

function AnimalCard({ animal }) {
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);
  const [jaSolicitou, setJaSolicitou] = useState(false);

  useEffect(() => {
    async function checarSolicitacao() {
      // Pega o ID do usuário (trata se o campo for id ou _id)
      const idUsuario = usuario?.id || usuario?._id;

      // Se não houver usuário logado ou se for admin, não precisa checar
      if (!usuario || !idUsuario || usuario.tipo === "admin") return;

      try {
        // Envia o ID do usuário na query string
        const resposta = await api.get(`/solicitacoes?usuario=${idUsuario}`);

        // Verifica se O USUÁRIO LOGADO solicitou ESTE animal e a solicitação não está cancelada
        const solicitou = resposta.data.some((sol) => {
          const idAnimalSolicitacao = sol.animal?._id || sol.animal;
          const idUsuarioSolicitacao = sol.usuario?._id || sol.usuario;

          return (
            idAnimalSolicitacao === animal._id &&
            String(idUsuarioSolicitacao) === String(idUsuario) &&
            sol.status !== "cancelada"
          );
        });

        setJaSolicitou(solicitou);
      } catch (error) {
        console.error("Erro ao verificar status da solicitação:", error);
      }
    }

    checarSolicitacao();
  }, [usuario, animal._id]);

  return (
    <div className="animal-card">
      <div className="animal-foto">
        {animal.imagem ? (
          <img src={animal.imagem} alt={animal.nome} />
        ) : (
          <span>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
              alt="Patinha" 
              style={{ width: "50px", height: "50px" }} 
            />
          </span>
        )}
      </div>

      <div className="animal-info">
        <h3>{animal.nome}</h3>

        <p>
          <strong>Espécie:</strong> {animal.especie}
        </p>

        <p>
          <strong>Raça:</strong> {animal.raca}
        </p>

        <p>
          <strong>Idade:</strong> {animal.idade} anos
        </p>

        <p>
          <strong>Sexo:</strong> {animal.sexo}
        </p>

        {animal.descricao && (
          <p className="descricao">{animal.descricao}</p>
        )}

        {/* Oculta opções de adoção para o administrador */}
        {usuario?.tipo !== "admin" && (
          <>
            {jaSolicitou ? (
              <button className="btn-solicitado" disabled>
                Solicitação enviada 
              </button>
            ) : (
              <button
                onClick={() => navigate(`/solicitar-adocao/${animal._id}`)}
              >
                Quero Adotar 
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AnimalCard;