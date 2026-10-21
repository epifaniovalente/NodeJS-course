import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';
import id from 'zod/v4/locales/id.cjs';

export const autenticarService = {
  async entrar({ email, senha }) {
    //1º validar bo email
    const usuario = await prisma.cliente.findUnique({
      where: { email: email },
    });
    if (!usuario) {
      throw new AppError('Email ou senha incorreto', 401);
    }

    //2º validar a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new AppError('Email ou senha Incorreta', 401);
    }

    //3º Gerar o token
    const tokenValido = jwt.sign(
      { email: usuario.email },
      process.env.JWT_SECRET,
      { subject: usuario.id, expiresIn: '1d' }
    );

    return {
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      tokenValido,
    };
  },
};
