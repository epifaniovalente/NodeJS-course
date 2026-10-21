import express from 'express';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './src/middleware/errorHandler.js';
import { deletarUsuarioAuditoria } from './src/services/deletarUsuarioAuditoria.js';
import cors from 'cors';

const servidor = express();
servidor.use(express.json());
servidor.use(cors());

const users = [];

const prisma = new PrismaClient();

// Adicionando usuarios
servidor.post('/usuarios', async (req, resp) => {
  await prisma.user.create({
    data: {
      nome: req.body.nome,
      email: req.body.email,
      idade: req.body.idade,
    },
  });

  resp.status(201).json(req.body);
});

// Actualizar Usuario
servidor.put('/usuarios/:id', async (req, resp) => {
  await prisma.user.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      email: req.body.email,
      // nome: req.body.nome,
      // idade: req.body.idade,
    },
  });

  resp.status(201).json(req.body);
});

// deletar
servidor.delete('/usuarios/:id', async (req, resp) => {
  await prisma.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  // deletarUsuarioAuditoria(Number(req.params.id));

  resp.status(200).json({ message: 'Usuario Deletado com sucesso!' });
});

// Buscar Usuarios do sistema
servidor.get('/usuarios', async (req, resp) => {
  if (req.query) {
    const lista = await prisma.user.findMany({
      where: {
        nome: req.query.nome,
      },
    });
    return resp.status(200).json(lista);
  }

  const todos = await prisma.user.findMany();
  return resp.status(200).json(todos);
});

servidor.get('/usuarios/:id', async (req, resp) => {
  if (req.params) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
      select: { nome: true, email: true },
    });

    return resp.status(200).json(user);
  }
});

servidor.use(errorHandler);

servidor.listen('3030', () => {
  console.log('Servidor no Ar! Porta 3030');
});

export default servidor;
