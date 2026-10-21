import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

export const authGlobalService = {
  async singin(dados) {
    const senhaCripto = await bcrypt.hash(dados.senha, 10);
    const novoCliente = await prisma.cliente.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: senhaCripto,
        Cidade: dados.cidade,
      },
      select: { id: true, nome: true, email: true, Cidade: true },
    });

    return novoCliente;
  },

  async login(dados) {
    const usuario = await prisma.cliente.findUnique({
      where: { email: dados.email },
    });
    
    if (!usuario) {
      throw new Error('Credenciais invalidas!');
    }
    const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);

    if (!senhaValida) {
      throw new Error('Credenciais invalidas!');
    }

    // Depois de validar as credenciais Geramos o token de acesso, que recebe três parametros (Dados do usuario(platloud), Assinatura de acesso, Tempo de expiração)
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    //Retornar o token com os dados
    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token,
    };
  },
};
