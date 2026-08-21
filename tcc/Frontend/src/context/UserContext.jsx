import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {

    const [usuario, setUsuarioState] = useState(() => {

        const usuarioSalvo = localStorage.getItem("usuario");

        if (!usuarioSalvo) {
            return null;
        }

        try {
            return JSON.parse(usuarioSalvo);
        } catch {
            localStorage.removeItem("usuario");
            return null;
        }
    });

    // Função central para atualizar estado + localStorage de uma vez
    function setUsuario(novosDados) {
        if (!novosDados) {
            setUsuarioState(null);
            localStorage.removeItem("usuario");
            return;
        }

        // Mantém as propriedades antigas (como token) e mescla com os novos dados
        setUsuarioState((prev) => {
            const usuarioAtualizado = { ...prev, ...novosDados };
            localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
            return usuarioAtualizado;
        });
    }

    function login(usuarioDados) {
        setUsuario(usuarioDados);
    }

    function logout() {
        setUsuario(null);
    }

    return (
        <UserContext.Provider
            value={{
                usuario,
                setUsuario,
                login,
                logout
            }}
        >
            {children}
        </UserContext.Provider>
    );
}