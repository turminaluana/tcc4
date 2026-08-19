import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";

function Navbar() {

    const { usuario, logout } =
        useContext(UserContext);

    const navigate = useNavigate();

    function sair() {

        logout();

        navigate("/login");
    }

    return (
        <nav className="navbar">

            <Link
                to="/animais"
                className="logo"
            >
                AdotaPet 🐾
            </Link>

            <div className="navbar-direita">

                {usuario && (
                    <span>
                        Olá, {usuario.nome}! 👋
                    </span>
                )}

                <Link to="/animais">
                    Animais
                </Link>

                {usuario && (
                    <Link to="/minhas-solicitacoes">
                        Minhas solicitações
                    </Link>
                )}

                {usuario?.tipo === "admin" && (
                    <Link to="/admin">
                        Painel Admin
                    </Link>
                )}

                {usuario ? (

                    <button
                        type="button"
                        onClick={sair}
                    >
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