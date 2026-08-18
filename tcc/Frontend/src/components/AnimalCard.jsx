import React from "react";
import "./AnimalCard.css";

function AnimalCard({ animal }) {
  return (
    <div className="animal-card">

      <div className="animal-foto">
        {animal.foto ? (
          <img
            src={animal.foto}
            alt={animal.nome}
          />
        ) : (
          <span>🐾</span>
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

        <p>
          <strong>Saúde:</strong> {animal.statusSaude}
        </p>

        <p className="descricao">
          {animal.descricao}
        </p>

        <button>
          Quero Adotar 🐾
        </button>

      </div>

    </div>
  );
}

export default AnimalCard;