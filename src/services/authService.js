import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const authService = {
  // cadastrar
  async cadastro({ nome, email, senha }) {
    // 1º criptografar a senha (hash com 10 custos)
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    //2º Salavr no banco de dados(MySQL)
    const usuario = await prisma.usuarios.create({
      data: { nome, email, senha: senhaCriptografada },
      select: { id: true, nome: true, email: true }, //Não returnara a senha na resposta de sucesso
    });

    return usuario;
  },

  async login({ email, senha }) {
    //1º verificar se o usuario existe

    const ususrio = await prisma.usuarios.findUnique({ where: { email } });
    if (!ususrio) {
      throw new Error('Cedenciais Invalida');
    }

    //2º Comparar a senha enviada com o hash no banco
    const senhaValida = await bcrypt.compare(senha, ususrio.senha);
    if (!senhaValida) {
      throw new Error('Credencias invalida');
    }

    //3º gerar o Token JWT com expiração de 1 dia
    const token = jwt.sign(
      { id: ususrio.id, nome: ususrio.nome, email: ususrio.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      usuarioLog: { id: ususrio.id, nome: ususrio.nome, email: ususrio.email },
      token,
    };
  },
};
