import z from 'zod';
import { usuarioService } from '../services/usuarioService.js';

const regraValidação = z.object({
  nome: z
    .string()
    .min(3, { message: 'O Nome deve ter pelo menos 3 carcteres' }),
  email: z.email({ message: 'insira um email válido' }),
});

const controllerUsuarios = {
  // Listar Usuarios
  listar(req, resp) {
    const lista = usuarioService.lisarTodos();
    return resp.status(200).json(lista);
  },

  // criar novos dados
  criar(req, resp) {
    const resultado = regraValidação.safeParse(req.body);
    if (!resultado.success) {
      const errosFormat = resp.status(400).json({
        erros: resultado.error.issues.map((issue) => {
          return {
            campo: issue.path[0],
            mensagem: issue.message,
          };
        }),
      });
      return resp.status(400).json({
        erros: errosFormat,
      });
    }

    const novoDado = usuarioService.criar(resultado.data);
    return resp.status(201).json('Usuario criado com sucesso ', { novoDado });
  },
};

export default controllerUsuarios;
