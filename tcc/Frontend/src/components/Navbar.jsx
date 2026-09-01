import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";

function Navbar() {
    const { usuario, logout } = useContext(UserContext);
    const navigate = useNavigate();

    function sair() {
        logout();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <Link to="/animais" className="logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                AdotaPet
                <img 
                    src="https://img.magnific.com/vetores-gratis/impressao-paw-brown-desenhada-a-mao_78370-6281.jpg?semt=ais_hybrid&w=740&q=80" 
                    alt="Patinha" 
                    style={{ width: "24px", height: "24px" }} 
                />
            </Link>

            <div className="navbar-direita">
                {usuario && (
                    <span>
                        Olá, {usuario.nome}!
                    </span>
                )}

                {/* Exibe o link "Animais" APENAS se o usuário NÃO for administrador */}
                {usuario?.tipo !== "admin" && (
                    <Link to="/animais">
                        Animais
                    </Link>
                )}

                {/* Exibe apenas se o usuário ESTIVER logado e NÃO FOR admin */}
                {usuario && usuario.tipo !== "admin" && (
                    <Link to="/minhas-solicitacoes">
                        Minhas solicitações
                    </Link>
                )}

                {usuario && (
                    <Link to="/minha-conta">
                        Minha conta
                    </Link>
                )}

                {usuario?.tipo === "admin" && (
                    <Link to="/admin">
                        Painel Admin
                    </Link>
                )}

                {usuario ? (
                    <button type="button" onClick={sair}>
                        Sair
                    </button>
                ) : (
                    <Link to="/login">
                        Entrar
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;