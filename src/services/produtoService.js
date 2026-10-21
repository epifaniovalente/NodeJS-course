import { prisma } from '../lib/prisma.js';

export const produtoService = {
  async criar(dados) {
    const verificar = await prisma.produto.findUnique({
      where: {
        nome: dados.nome,
      },
    });

    if (verificar) {
      throw new Error('Já existe um produto com este nome.');
    }

    const produto = await prisma.produto.create({
      data: {
        nome: dados.nome,
        preco: Number(dados.preco),
      },
    });
    return produto;
  },

  async listar() {
    const lista = await prisma.produto.findMany();
    return lista;
  },

  async apagar(id) {
    const produtoValido = await prisma.produto.findUnique({
      where: { id: Number(id) },
    });
    if (!produtoValido) {
      throw new Error('Produto não encontrado');
    }

    const resultado = await prisma.produto.delete({
      where: { id: produtoValido.id },
    });

    return resultado;
  },

  async editar(id, dados) {
    const produtoValido = await prisma.produto.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!produtoValido) {
      throw new Error('Este produto não existe! Tente Novamente');
    }

    const produto = await prisma.produto.update({
      where: {
        id: produtoValido.id,
      },
      data: {
        nome: dados.nome,
        preco: Number(dados.preco),
      },
      select: { id: true, nome: true, preco: true },
    });

    return produto;
  },
};
