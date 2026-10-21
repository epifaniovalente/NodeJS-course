import { z } from 'zod';
import { produtoService } from '../services/produtoService.js';

const validarProd = z.object({
  nome: z
    .string()
    .min(4, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  preco: z
    .number()
    .positive()
    .min(900, { message: 'O preço não deve ser abaixo de 900' }),
});

export const produtoController = {
  async Cadastrar(req, response) {
    try {
      const produtoValido = validarProd.safeParse(req.body);
      if (!produtoValido.success) {
        const erros = produtoValido.error.issues.map((element) => {
          return {
            campo: element.path[0],
            message: element.message,
          };
        });

        return response.status(400).json({erros:erros});
      }
      const produto = await produtoService.criar(produtoValido.data);
      return response.status(201).json(produto);
    } catch (error) {
      return response.status(500).json({ erro: error.message });
    }
  },

  async Buscar(req, resp) {
    try {
      const produto = await produtoService.listar();
      return resp.status(200).json(produto);
    } catch (error) {
      return resp.status(500).json({ erro: error.message });
    }
  },

  async deletar(req, resp) {
    try {
      const { id } = req.params;
      const produto = await produtoService.apagar(id);
      return resp.status(205).json(produto);
    } catch (error) {
      return resp.status(500).json({ erro: error.message });
    }
  },

  async atualizar(req, resp) {
    try {
      const { id } = req.params;
      const produto = await produtoService.editar(id, req.body);
      return resp.status(200).json(produto);
    } catch (error) {
      return resp.status(500).json({ erro: error.message });
    }
  },
};
