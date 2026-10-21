import { z } from 'zod';
import { serviceHelpdesk } from '../services/ServiceHepldesk.js';

const validarChamado = z.object({
  titulo: z.string().min(4, { message: 'O chamado deve ter um titulo' }),
  descricao: z
    .string()
    .nonempty({ message: 'Descreva um pouco, oque esta acontecendo' }),
  prioridade: z.string().optional(),
});

export const controllerHelpdesk = {
  // ========== CRIAR CHAMADO ==========
  async createChamdo(req, res) {
    try {
      const chamado = validarChamado.safeParse(req.body);
      const clientID = req.user.id;

      if (!chamado.success) {
        const errorFormated = chamado.error.issues.map((issue) => {
          return {
            campo: issue.path[0],
            message: issue.message,
          };
        });
        return res.status(404).json({ error: errorFormated });
      }

      const novoChamdo = await serviceHelpdesk.newChamado(
        clientID,
        chamado.data
      );
      return res.status(201).json({ message: 'Chamado criado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ========== LISTAR CHAMADOS =================
  async getChamados(req, res) {
    try {
      const { userID } = req.user.id;
      const { role } = req.user.role;

      const lista = await serviceHelpdesk.ListarChamados(userID, role);
      return res.json(lista);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ======= BUSCAR DE DETALHE DO CHAMADO ========
  async getDetalheChamado(req, res) {
    try {
      // PEGAR O ID DO CHAMADO VINDO DA URL
      const { chamadoID } = req.params;
      // console.log(chamadoID);

      // DADOS DO USUARIO AUTENTICADO
      const { userAuth } = req.user.id;

      if (!chamadoID) {
        res
          .status(404)
          .json({ error: 'Selecione o chamado que deseja ver detalhadamente' });
      }
      const chamado = await serviceHelpdesk.detalheChamado(chamadoID, userAuth);

      if (!chamado) {
        return res
          .status(404)
          .json({ error: 'Chamdo não encontrado ou não existe!' });
      } else {
        return res.status(200).json(chamado);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ======= ACTUALIZAR CHAMDO =======
  async atualizarChamado(req, res) {
    try {
      const { idChamado } = req.params;
      const { statusChamdo } = req.body;

      // ==== VERIFICAR SE O CHAMDO EXISTE ======
      const verChamado = await serviceHelpdesk.consultarChamado(idChamado);
      if (verChamado) {
        return res.status(404).json({ message: 'Chamado não encontrado' });
      }

      // ================= ACTUALIZAR O STAUS ===============
      const novoStatus = await serviceHelpdesk.updateChamado(
        verChamado.id,
        statusChamdo
      );

      // =========  =========

      return res.status({ message: 'Estado de Chamado atualizado' });
    } catch (error) {}
  },
};
