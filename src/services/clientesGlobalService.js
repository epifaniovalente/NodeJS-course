import { prisma } from '../lib/prisma.js';

export const clientesGlobalService = {
  async listarClientes(nome) {
    if (nome) {
      const clientes = await prisma.cliente.findMany({
        where: { nome: nome },
        select: { nome: true, email: true, Cidade: true },
      });
      return clientes;
    }
    const clientes = await prisma.cliente.findMany({
      select: { id: true, nome: true, email: true, Cidade: true },
    });
    return clientes;
  },

  async atualizarCliente(id, dados) {
    const verID = await prisma.cliente.findUnique({
      where: { id: Number(id) },
    });
    if (!verID) {
      throw new Error('Usuario não encontrado nos registros!');
    }
    // return dados

    const cliente = await prisma.cliente.update({
      where: { id: verID.id },
      data: { nome: dados.nome, email: dados.email, Cidade: dados.cidade },
      select: { nome: true, email: true, Cidade: true },
    });

    return cliente;
  },
};
