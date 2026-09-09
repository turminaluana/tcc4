import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

export async function criarUsuario(req, res) {
  try {
    const {
      nome,
      cpf,
      email, // <--- ADICIONADO AQUI
      telefone,
      endereco,
      senha
    } = req.body;

    // 1. Validação dos campos obrigatórios
    if (!nome || !cpf || !email || !telefone || !endereco || !senha) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios."
      });
    }

    // 2. Verifica se CPF ou E-mail já estão cadastrados
    const usuarioExistente = await Usuario.findOne({
      $or: [{ cpf }, { email }]
    });

    if (usuarioExistente) {
      const campoDuplicado = usuarioExistente.cpf === cpf ? "CPF" : "E-mail";
      return res.status(400).json({
        mensagem: `${campoDuplicado} já cadastrado.`
      });
    }

    // 3. Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // 4. Cria o usuário com o email incluído
    const usuario = await Usuario.create({
      nome,
      cpf,
      email, // <--- ADICIONADO AQUI
      telefone,
      endereco,
      senha: senhaCriptografada,
      tipo: "adotante"
    });

    return res.status(201).json({
      mensagem: "Adotante cadastrado com sucesso.",
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        cpf: usuario.cpf,
        email: usuario.email,
        telefone: usuario.telefone,
        endereco: usuario.endereco,
        tipo: usuario.tipo
      }
    });

  } catch (error) {
    console.error("ERRO AO CADASTRAR:", error);

    return res.status(400).json({
      mensagem: "Erro ao cadastrar usuário.",
      erro: error.message
    });
  }
}

export async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.find().select("-senha");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao listar usuários."
    });
  }
}

export async function buscarUsuario(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-senha");

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado."
      });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar usuário."
    });
  }
}

export async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;

    const {
      nome,
      cpf,
      email, // <--- ADICIONADO AQUI
      telefone,
      endereco,
      senha
    } = req.body;

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado."
      });
    }

    // Verifica duplicação de CPF
    if (cpf && cpf !== usuario.cpf) {
      const cpfExistente = await Usuario.findOne({ cpf, _id: { $ne: id } });
      if (cpfExistente) {
        return res.status(400).json({
          mensagem: "Este CPF já está cadastrado para outro usuário."
        });
      }
      usuario.cpf = cpf;
    }

    // Verifica duplicação de E-mail
    if (email && email !== usuario.email) {
      const emailExistente = await Usuario.findOne({ email, _id: { $ne: id } });
      if (emailExistente) {
        return res.status(400).json({
          mensagem: "Este E-mail já está cadastrado para outro usuário."
        });
      }
      usuario.email = email;
    }

    if (nome) usuario.nome = nome;
    if (telefone) usuario.telefone = telefone;
    if (endereco) usuario.endereco = endereco;
    if (senha) usuario.senha = await bcrypt.hash(senha, 10);

    await usuario.save();

    return res.json({
      mensagem: "Dados atualizados com sucesso.",
      usuario: {
        id: usuario._id,
        _id: usuario._id,
        nome: usuario.nome,
        cpf: usuario.cpf,
        email: usuario.email,
        telefone: usuario.telefone,
        endereco: usuario.endereco,
        tipo: usuario.tipo
      }
    });

  } catch (error) {
    console.error("ERRO AO ATUALIZAR:", error);

    return res.status(500).json({
      mensagem: "Erro ao atualizar usuário.",
      erro: error.message
    });
  }
}

export async function removerUsuario(req, res) {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado."
      });
    }

    res.json({
      mensagem: "Usuário removido com sucesso."
    });

  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao remover usuário."
    });
  }
}