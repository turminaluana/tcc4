import React from "react";
import { useNavigate } from "react-router-dom";


function AnimalCard({ animal }) {

    const navigate = useNavigate();

    function solicitarAdocao() {

        navigate(`/solicitar-adocao/${animal._id}`);

    }

    return (
        <div className="animal-card">

            <div className="animal-foto">

                {animal.imagem ? (

                    <img
                        src={animal.imagem}
                        alt={animal.nome}
                    />

                ) : (

                    <span>
                        🐾
                    </span>

                )}

            </div>

            <div className="animal-info">

                <h3>
                    {animal.nome}
                </h3>

                <p>
                    <strong>Espécie:</strong>{" "}
                    {animal.especie}
                </p>

                <p>
                    <strong>Raça:</strong>{" "}
                    {animal.raca}
                </p>

                <p>
                    <strong>Idade:</strong>{" "}
                    {animal.idade} anos
                </p>

                <p>
                    <strong>Sexo:</strong>{" "}
                    {animal.sexo}
                </p>

                {animal.descricao && (
                    <p className="descricao">
                        {animal.descricao}
                    </p>
                )}

                <button
                  onClick={() =>
                    navigate(`/solicitar-adocao/${animal._id}`)
                  }
                >
                  Quero Adotar 🐾
                </button>

            </div>

        </div>
    );
}

export default AnimalCard;