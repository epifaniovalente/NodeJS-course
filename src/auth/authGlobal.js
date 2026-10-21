import { z } from 'zod';
import { authGlobalService } from '../services/authGlobalService.js';

const validarLogin = z.object({
  email: z.email({ message: 'Email é obrigatório' }).trim(),
  senha: z.string().min(8, { message: 'Insira a sua senha' }),
});

const validarCadastro = z.object({
  nome: z
    .string()
    .min(4, { message: 'O nome deve ter pelo meno 4 caracteres' }),
  email: z.email({ message: 'email é obrigatorio' }).trim(),
  senha: z.string().min(8, { message: 'Sua senha precisa ter 8 caracteres.' }),
  cidade: z.string({ message: 'Digite a sua cidade' }).trim().optional(),
});
export const authGlobal = {
  async cadastrar(req, resp) {
    try {
      const clienteValido = validarCadastro.safeParse(req.body);

      if (!clienteValido.success) {
        const erroFormated = clienteValido.error.issues.map((issue) => {
          return {
            campo: issue.path[0],
            info: issue.message,
          };
        });

        return resp.status(400).json(erroFormated);
      }

      const novoCliente = await authGlobalService.singin(clienteValido.data);
      return resp.status(201).json(novoCliente);
      
    } catch (error) {
      return resp.status(500).json(error.message);
    }
  },

  async login(req, resp) {
    try {
      const dados = validarLogin.safeParse(req.body);

      if (!dados.success) {
        const errosFormat = dados.error.issues.map((issue) => {
          return {
            campo: issue.path[0],
            message: issue.message,
          };
        });
        return resp.status(400).json({ erros: errosFormat });
      }

      // const { email, senha } = req.body;
      const user = await authGlobalService.login(dados.data);
      return resp.status(200).json(user);
    } catch (error) {
      return resp.status(500).json({ error: error.message });
    }
  },
};
