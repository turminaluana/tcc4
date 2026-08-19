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
import SolicitarAdocao from "./pages/SolicitarAdocao";
import MinhasSolicitacoes from "./pages/MinhasSolicitacoes";
import Admin from "./pages/Admin";
import AdminAnimais from "./pages/AdminAnimais";
import CadastrarAnimal from "./pages/CadastrarAnimal";
import AdminRoute from "./components/AdminRoute";

function App() {

    return (
        <BrowserRouter>

            <UserProvider>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                            />
                        }
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

                    <Route
                        path="/solicitar-adocao/:id"
                        element={
                            <PrivateRoute>
                                <SolicitarAdocao />
                            </PrivateRoute>
                        }
                    />

                    <Route
                      path="/minhas-solicitacoes"
                      element={
                        <PrivateRoute>
                          <MinhasSolicitacoes />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <Admin />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/animais"
                      element={
                          <AdminRoute>
                              <AdminAnimais />
                          </AdminRoute>
                      }
                  />

                  <Route
                      path="/admin/animais/cadastrar"
                      element={
                          <AdminRoute>
                              <CadastrarAnimal />
                          </AdminRoute>
                      }
                  />

                </Routes>

            </UserProvider>

        </BrowserRouter>
    );
}

export default App;