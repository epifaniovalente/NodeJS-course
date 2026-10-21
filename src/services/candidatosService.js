import { prisma } from '../lib/prisma.js';
export const candidatosService = {
  // Listar todos os daddos
  async listarCandidatos() {
    return await prisma.candidatos.findMany();
  },

  // Listar por ID-Busca
  async ListarID(idUser) {
    return await prisma.candidatos.findUnique({
      where: { id: Number(idUser) },
    });
  },

  // Criar candidato - Inserir dados
  async criar(dadosUser) {
    return await prisma.candidatos.create({
      data: {
        nome: dadosUser.nome,
        email: dadosUser.email,
        idade: dadosUser.idade,
      },
    });
  },

  // Actualizar Dados
  async atualizarCand(idUser, dadosUser) {
    return await prisma.candidatos.update({
      where: { id: Number(idUser) },
      data: dadosUser,
    });
  },

  // Deletar candidato
  async apagarCand(idUser) {
    return await prisma.candidatos.delete({
      where: { id: Number(idUser) },
    });
  },
};
