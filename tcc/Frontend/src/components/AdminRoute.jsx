import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";

function AdminRoute({ children }) {

    const { usuario } = useContext(UserContext);

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (usuario.tipo !== "admin") {
        return <Navigate to="/animais" replace />;
    }

    return children;
}

export default AdminRoute;