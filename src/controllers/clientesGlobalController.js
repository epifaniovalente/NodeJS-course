import { z } from 'zod';
import { clientesGlobalService } from '../services/clientesGlobalService.js';

const validarDados = z.object({
  nome: z.string().min(4, { message: 'Nome deve ter 4 caracteres' }),
  email: z.email({ message: 'email é obrigratorio' }),
  cidade: z.string().min(4, { message: 'digite sua cidade.' }),
});

export const clientesGlobalController = {
  // Listar Clientes
  async readyClientes(req, resp) {
    try {
      const { nome } = req.query;
      if (nome) {
        const pesquisa = await clientesGlobalService.listarClientes(nome);
        return resp.status(200).json(pesquisa);
      }
      const lista = await clientesGlobalService.listarClientes();
      return resp.status(200).json(lista);
    } catch (error) {
      return resp.status(500).json(error);
    }
  },

  async updateCliente(req, resp) {
    try {
      const { id } = req.params;
      const dados  = validarDados.safeParse(req.body);
      if (!dados.success) {
        const errorFormated = dados.error.issues.map((issue)=>{
          return{
            campo:issue.path[0],
            info:issue.message
          }
        })
        return resp.status(400).json(errorFormated)
      }
      if (id) {
        const clienteUp = await clientesGlobalService.atualizarCliente(
          id,
          dados.data
        );
        return resp.status(200).json(clienteUp);
      }

      return resp.status(400).json({ message: 'usuario não encontrado' });
    } catch (error) {
      return resp.status(500).json({ erro: error.message });
    }
  },
};
