import { z } from 'zod';
import { escolaService } from '../services/escolaService.js';

const validar = z.object({
  nome: z
    .string()
    .min(4, { message: 'o nome deve ter pelo menos 4 carcteres.' }),
  email: z.email({ message: 'dige correto o seu email.' }),
});

const validarTurma = z.object({
  nomeTurma: z
    .string()
    .min(7, { message: 'O nome da turma deve ter 8+ caracteres.' }),
});

export const escolaController = {
  // Add Turma
  async cadTurma(req, resp) {
    try {
      const turmaValida = validarTurma.safeParse(req.body);
      if (!turmaValida.success) {
        return resp.status(400).json({ erro: turmaValida.error.issues });
      }
      const novaTurma = await escolaService.addTurma(turmaValida.data);

      return resp.status(201).json(novaTurma);
    } catch (error) {
      return resp.status(500).json({ erro: error.message });
    }
  },

  //Add Aluno
  async cadAluno(req, resp) {
    try {
      const alunoValido = validar.safeParse(req.body);
      if (!alunoValido.success) {
        const erroFormat = resp.status(400).json({
          erro: alunoValido.error.issues.map((issue) => {
            return {
              campo: issue.path,
              info_erro: issue.message,
            };
          }),
        });
        return resp.status(400).json({ erro: erroFormat });
      }

      const novoAluno = await escolaService.cadastrarAluno(alunoValido.data);
      return resp.status(201).json({ message: 'Cadastrado com sucesso' });
    } catch (error) {
      return resp.status(500).json({ erro: error.message });
    }
  },

  // Listar Todos Alunos
  async buscarAlunos(req, resp) {
    try {
      const alunos = await escolaService.listaAlunos();
      if (!alunos) {
        return resp.status(404).json({ erro: 'Não eiste alunos Cadastrados' });
      }

      return resp.status(200).json(alunos);
    } catch (error) {
      return resp.status(200).json({ erro: 'erro ao bsucar alunos' });
    }
  },

  // Listar Todas Turma

  async buscarTurmas(req, resp) {
    try {
      const turmas = await escolaService.ListarTodasTurmas();
      if (!turmas) {
        return resp.status(400).json({ erro: 'Nenhum turma cadastrada.' });
      }
      return resp.status(200).json(turmas);
    } catch (error) {
      return resp.status(500).json({ erro: error.message });
    }
  },

  // Listar Turma por ID

  async listar(req, resp) {
    try {
      const { idTurma } = req.params;
      const lista = await escolaService.ListarTurma(idTurma);
      if (!lista) {
        return resp.status(404).json({ erro: 'Turma não encontrada' });
      }
      return resp.status(200).json(lista);
    } catch (error) {
      resp.status(500).json({ erro: error.message });
    }
  },
};
