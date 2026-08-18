import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {

  const [usuario, setUsuario] = useState(() => {

    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo) {
      return JSON.parse(usuarioSalvo);
    }

    return null;
  });

  function login(usuarioDados) {

    setUsuario(usuarioDados);

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuarioDados)
    );
  }

  function logout() {

    setUsuario(null);

    localStorage.removeItem("usuario");
  }

  return (
    <UserContext.Provider
      value={{
        usuario,
        login,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
}