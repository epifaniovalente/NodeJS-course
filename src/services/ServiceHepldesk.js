import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const serviceHelpdesk = {
  // ====== AUTENTICAÇÂO & CADASTRO ============
  async cadastrar(dados) {
    const { nome, email, senha } = dados;

    const senhaCripto = await bcrypt.hash(senha, 10);
    const novoUser = await prisma.usuarios.create({
      data: {
        nome: nome,
        email: email,
        senha: senhaCripto,
      },
      select: { nome: true, email: true, role: true },
    });

    return novoUser;
  },

  // =================================================
  // =============== REALIZAR LOGIN ==================
  // =================================================
  async login(dados) {
    const { email, senha } = dados;

    const userValido = await prisma.usuarios.findUnique({
      where: {
        email: email,
      },
    });

    if (!userValido) {
      throw new Error('email incorreto, verifique e tente novamente');
    }

    const senhaValida = await bcrypt.compare(senha, userValido.senha);

    if (!senhaValida) {
      throw new Error('senha incorreta!');
    }

    // ========= CRIAR O TOKEN ==========
    const token = jwt.sign(
      { id: userValido.id, role: userValido.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // =========== GRAVAR O COOKIE HTTP NO NAVEGADOR ===========

    return {
      usuario: {
        id: userValido.id,
        nome: userValido.nome,
        email: userValido.email,
      },
      token,
    };
  },
  // ============ ROTA GET SESSAO ================
  async getMe(id) {
    const userData = await prisma.usuarios.findUnique({
      where: {
        id: id,
      },
    });

    return userData;
  },

  // =========================================
  // =========================================
  // =========================================

  async consultarChamado(idChamado) {
    const unicoChamado = await prisma.chamados.findUnique({
      where: {
        idChamado,
      },
      select: {
        id: true,
        status: true,
      },
    });
    

    return unicoChamado;
  },

  // ============= CRIAR CHAMDO ====================
  async newChamado(clientID, data) {
    // console.log(clientID);

    const novoChamado = await prisma.chamados.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        clienteId: String(clientID),
        prioridade: data.prioridade || 'Media',
      },
    });

    return novoChamado;
  },

  // ======== LISTAR CHAMADOS ===========
  async ListarChamados(userID, role) {
    const condicao = role === 'Cliente' ? { clientID: userID } : {};
    const chamados = await prisma.chamados.findMany({
      where: condicao,
      select: {
        id: true,
        titulo: true,
        status: true,
        prioridade: true,
        createdAt: true,
        // ==== - DADOS DO CLIENTE - =====
        usuarios: {
          select: {
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return chamados;
  },

  // ======= BUSCAR DE DETALHE DO CHAMADO ========
  async detalheChamado(chamadoID, userAuth) {
    // const { userID } = userAuth.id;
    // const { roleUser } = userAuth.role;

    if (!chamadoID) {
      throw new Error('Erro no ID do chamado ');
    }

    // ======= BUSCAR O USUARIO =======
    // const usuario = await prisma.usuarios.findUnique({
    //   where: {
    //     id: userAuth,
    //   },
    //   select: {
    //     role: true,
    //   },
    // });

    // if (chamado.clientID === userAuth || usuario.role === 'Admin') {
    //   console.log('Ola');
    // }

    const chamado = await prisma.chamados.findFirst({
      where: { AND: [{ id: chamadoID }, { clienteId: userAuth }] },
      select: {
        id: true,
        titulo: true,
        status: true,
        descricao: true,
        prioridade: true,
        createdAt: true,
        updatedAt: true,
        usuarios: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        comentarios: {
          where: {
            chamadoID: chamadoID,
          },
          select: {
            id: true,
            texto: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return chamado;
  },

  // ======= ACTUALIZAR STATUS ======
  async updateChamado(idChamado) {},
};
