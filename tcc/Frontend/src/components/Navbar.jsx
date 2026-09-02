import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Navbar({ filtros, setFiltros }) {
    const { usuario, logout } = useContext(UserContext);
    const navigate = useNavigate();

    function sair() {
        logout();
        navigate("/login");
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <nav className="navbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "15px", padding: "10px 20px" }}>
            {/* Logo */}
            <Link to={usuario?.tipo === "admin" ? "/admin" : "/animais"} className="logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                AdotaPet
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/8168/8168871.png" 
                    alt="Patinha" 
                    style={{ width: "24px", height: "24px" }} 
                />
            </Link>

            {/* Barra de Pesquisa e Filtros */}
            {filtros && setFiltros && (
                <div className="navbar-filtros" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                        type="text"
                        name="busca"
                        placeholder="Nome..."
                        value={filtros.busca || ""}
                        onChange={handleChange}
                        style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.85rem", width: "110px" }}
                    />

                    <select 
                        name="especie" 
                        value={filtros.especie || ""} 
                        onChange={handleChange}
                        style={{ padding: "5px 8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.85rem" }}
                    >
                        <option value="">Todas espécies</option>
                        <option value="gato">Gato</option>
                        <option value="cachorro">Cachorro</option>
                        <option value="outro">Outro</option>
                    </select>

                    <input
                        type="text"
                        name="raca"
                        placeholder="Raça..."
                        value={filtros.raca || ""}
                        onChange={handleChange}
                        style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.85rem", width: "90px" }}
                    />

                    <select 
                        name="sexo" 
                        value={filtros.sexo || ""} 
                        onChange={handleChange}
                        style={{ padding: "5px 8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.85rem" }}
                    >
                        <option value="">Todos sexos</option>
                        <option value="macho">Macho</option>
                        <option value="femea">Fêmea</option>
                    </select>

                    <input
                        type="text"
                        name="idade"
                        placeholder="Idade..."
                        value={filtros.idade || ""}
                        onChange={handleChange}
                        style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.85rem", width: "70px" }}
                    />

                    <button
                        type="button"
                        onClick={() => setFiltros({ busca: "", especie: "", raca: "", sexo: "", idade: "" })}
                        style={{
                            backgroundColor: "#795548",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        Limpar
                    </button>
                </div>
            )}

            {/* Menu direito */}
            <div className="navbar-direita" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {usuario && <span>Olá, {usuario.nome || "Administrador"}!</span>}
                {usuario?.tipo !== "admin" && <Link to="/animais">Animais</Link>}
                {usuario && usuario.tipo !== "admin" && <Link to="/minhas-solicitacoes">Minhas solicitações</Link>}
                {usuario && <Link to="/minha-conta">Minha conta</Link>}
                {usuario?.tipo === "admin" && <Link to="/admin">Painel Admin</Link>}

                {usuario ? (
                    <button type="button" onClick={sair} style={{ backgroundColor: "#795548", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 16px", cursor: "pointer" }}>
                        Sair
                    </button>
                ) : (
                    <Link to="/login">Entrar</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;