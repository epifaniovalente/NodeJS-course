import { z } from 'zod';
import { candidatosService } from '../services/candidatosService.js';

const validarDados = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 carcteres ' }),
  email: z.email({ message: 'digite um email valido' }),
  idade: z.string(),
});

const candidatosController = {
  // listar
  async listarCandidatos(req, resp) {
    try {
      const lista = await candidatosService.listarCandidatos();
      return resp.status(200).json(lista);
    } catch (error) {
      return resp.status(500).json({ error });
    }
  },

  // Buscar por ID
  async buscarId(req, resp) {
    try {
      const { id } = req.params;
      const candidato = await candidatosService.ListarID(id);
      if (!candidato) {
        return resp.status(404).json({ message: 'Usuario não encontrado' });
      }
      return resp.status(200).json(candidato);
    } catch (error) {
      return resp.status(500).json(error);
    }
  },

  // cadastrar

  async criarCandidato(req, resp) {
    try {
      const userResult = validarDados.safeParse(req.body);

      if (!userResult.success) {
        return resp.status(400).json({ erros: userResult.error.issues });
      }

      const novoUser = await candidatosService.criar(userResult.data);
      return resp.status(201).json(novoUser);

    } catch (error) {
      return resp.status(500).json({ message: 'Erro ao criar usuario,' });
    }
  },

  async atualizar() {
    
  },

  // Deletar dados
  async apagarCandidato(req, resp) {
    try {
      const { id } = req.params;
      await candidatosService.apagarCand(id);

      return resp.status(204).send();
    } catch (error) {
      return resp
        .status(400)
        .json({ message: 'Não possivel deletar usuario!' });
    }
  },
};

export default candidatosController;
