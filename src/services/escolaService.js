import { prisma } from '../lib/prisma.js';

export const escolaService = {
  async cadastrarAluno({ dados }) {
    const novoAluno = await prisma.aluno.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        turmaId: dados.turmaId,
      },
    });

    return novoAluno;
  },

  async addTurma({ nomeTurma }) {
    const novaTurma = await prisma.turma.create({
      data: {
        nomeTurma: nomeTurma,
      },
    });
    return novaTurma;
  },

  async addAlunoNaTurma({ turma, alunoId }) {
    const adicionado = await prisma.turma.update({
      data: { alunoId },
      where: { nomeTurma: turma },
    });

    return adicionado;
  },

  // Listar Todos Alunos
  async listaAlunos() {
    const alunos = await prisma.aluno.findMany();
    return alunos;
  },

  async ListarTurma({ idTurma }) {
    const lista = await prisma.turma.findUnique({
      where: { id: Number(idTurma) },
      include: {
        aluno: true,
      },
    });

    return lista;
  },

  async ListarTodasTurmas() {
    const lista = await prisma.turma.findMany();
    return lista;
  },
};
