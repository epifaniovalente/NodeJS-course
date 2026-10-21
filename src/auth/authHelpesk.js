import { z } from 'zod';
import { serviceHelpdesk } from '../services/ServiceHepldesk.js';

const ValidarLogin = z.object({
  email: z.email({ message: 'seu email corparativo é obrigatório.' }),
  senha: z
    .string()
    .nonempty({ message: 'Insire sua senha para acessar sua conta.' }),
});

const validarCadastro = z.object({
  nome: z
    .string()
    .min(4, { message: 'seu nome deve conter mais de 4 caractres' }),
  email: z
    .string()
    .nonempty({ message: 'seu email corparativo é obrigatório.' }),
  senha: z
    .string()
    .nonempty()
    .min(6, { message: 'Crie uma senha para a sua conta com 6+ caracteres' }),
});

export const authHelpdesk = {
  // ========== FUNÇÂO PARA REALIZAR CADASTRO ==========
  async cadastrar(req, res) {
    try {
      const cadastroValido = validarCadastro.safeParse(req.body);

      if (!cadastroValido.success) {
        const errorFormated = cadastroValido.error.issues.map((issue) => {
          return {
            campo: issue.path[0],
            message: issue.message,
          };
        });
        return res.status(400).json({ error: errorFormated });
      }

      const novoUsuario = await serviceHelpdesk.cadastrar(cadastroValido.data);

      res.status(201).json(novoUsuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ========== FUNÇÂO PARA REALIZAR LOGIN ==========
  async entrar(req, res) {
    try {
      const usuarioValido = ValidarLogin.safeParse(req.body);
      if (!usuarioValido.success) {
        const errorFormated = usuarioValido.error.issues.map((issue) => {
          return {
            campo: issue.path[0],
            message: issue.message,
          };
        });
        return res.status(400).json({ error: errorFormated });
      }

      const usuario = await serviceHelpdesk.login(usuarioValido.data);

      // res.status(200).json(usuario);
      res
        .cookie('token', usuario.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(usuario.usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ========= OBTER DADOS DO USUARIO AUTENTICADO =============
  async getSessao(req, res) {
    const usuarioAuth = await serviceHelpdesk.getMe(req.usuario.id);

    if (!usuarioAuth) {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.json({
      id: usuarioAuth.id,
      nome: usuarioAuth.nome,
      email: usuarioAuth.email,
      role: usuarioAuth.role,
    });

  },

  // =========== FUNCAO DE LOGOUT ================

  async logout(req, res) {
    return res
      .clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ message: 'SUA SESSÃO FOI ENCERRADA.' });
  },
};
