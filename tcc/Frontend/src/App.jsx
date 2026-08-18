import React from "react";
import PrivateRoute from "./components/PrivateRoute";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { UserProvider } from "./context/UserContext";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Animais from "./pages/Animais";

function App() {
  return (
    <BrowserRouter>

      <UserProvider>

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/cadastro"
            element={<Cadastro />}
          />

          <Route
            path="/animais"
            element={
              <PrivateRoute>
              <Animais />
              </PrivateRoute>
           }
        />

        </Routes>

      </UserProvider>

    </BrowserRouter>
  );
}

export default App;