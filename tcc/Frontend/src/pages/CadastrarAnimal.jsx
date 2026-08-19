import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function CadastrarAnimal() {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [especie, setEspecie] = useState("cachorro");
    const [raca, setRaca] = useState("");
    const [idade, setIdade] = useState("");
    const [sexo, setSexo] = useState("macho");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState("");

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);


    async function cadastrarAnimal(e) {

        e.preventDefault();

        setMensagem("");
        setErro("");
        setCarregando(true);

        try {

            const resposta = await api.post(
                "/animais",
                {
                    nome,
                    especie,
                    raca,
                    idade: Number(idade),
                    sexo,
                    descricao,
                    imagem
                }
            );

            console.log(
                "ANIMAL CADASTRADO:",
                resposta.data
            );

            setMensagem(
                "Animal cadastrado com sucesso! 🐾"
            );

            setTimeout(() => {

                navigate("/admin/animais");

            }, 1000);


        } catch (error) {

            console.error(
                "ERRO AO CADASTRAR ANIMAL:",
                error
            );

            setErro(
                error.response?.data?.mensagem ||
                "Erro ao cadastrar animal."
            );

        } finally {

            setCarregando(false);

        }
    }


    return (
        <>
            <Navbar />

            <main className="admin-form">

                <h1>
                    Cadastrar animal 🐾
                </h1>

                <p>
                    Cadastre um animal para disponibilizá-lo
                    para adoção.
                </p>


                <form
                    onSubmit={cadastrarAnimal}
                    className="form-animal"
                >

                    <div className="campo">

                        <label>
                            Nome
                        </label>

                        <input
                            type="text"
                            value={nome}
                            onChange={(e) =>
                                setNome(e.target.value)
                            }
                            placeholder="Nome do animal"
                            required
                        />

                    </div>


                    <div className="campo">

                        <label>
                            Espécie
                        </label>

                        <select
                            value={especie}
                            onChange={(e) =>
                                setEspecie(e.target.value)
                            }
                            required
                        >

                            <option value="cachorro">
                                Cachorro
                            </option>

                            <option value="gato">
                                Gato
                            </option>

                            <option value="outro">
                                Outro
                            </option>

                        </select>

                    </div>


                    <div className="campo">

                        <label>
                            Raça
                        </label>

                        <input
                            type="text"
                            value={raca}
                            onChange={(e) =>
                                setRaca(e.target.value)
                            }
                            placeholder="Raça do animal"
                            required
                        />

                    </div>


                    <div className="campo">

                        <label>
                            Idade
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={idade}
                            onChange={(e) =>
                                setIdade(e.target.value)
                            }
                            placeholder="Idade em anos"
                            required
                        />

                    </div>


                    <div className="campo">

                        <label>
                            Sexo
                        </label>

                        <select
                            value={sexo}
                            onChange={(e) =>
                                setSexo(e.target.value)
                            }
                            required
                        >

                            <option value="macho">
                                Macho
                            </option>

                            <option value="femea">
                                Fêmea
                            </option>

                        </select>

                    </div>


                    <div className="campo">

                        <label>
                            URL da imagem
                        </label>

                        <input
                            type="text"
                            value={imagem}
                            onChange={(e) =>
                                setImagem(e.target.value)
                            }
                            placeholder="Cole a URL da imagem"
                        />

                    </div>


                    <div className="campo">

                        <label>
                            Descrição
                        </label>

                        <textarea
                            value={descricao}
                            onChange={(e) =>
                                setDescricao(e.target.value)
                            }
                            placeholder="Conte um pouco sobre o animal..."
                            rows="5"
                            required
                        />

                    </div>


                    {mensagem && (
                        <p className="mensagem-sucesso">
                            {mensagem}
                        </p>
                    )}


                    {erro && (
                        <p className="mensagem-erro">
                            {erro}
                        </p>
                    )}


                    <div className="form-acoes">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admin/animais")
                            }
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Cadastrando..."
                                : "Cadastrar animal 🐾"}
                        </button>

                    </div>

                </form>

            </main>
        </>
    );
}

export default CadastrarAnimal;