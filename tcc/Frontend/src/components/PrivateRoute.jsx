import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";

function PrivateRoute({ children }) {
  const { usuario } = useContext(UserContext);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;