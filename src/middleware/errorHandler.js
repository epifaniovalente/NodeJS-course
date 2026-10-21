import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { Prisma } from '@prisma/client';

export function errorHandler(error, req, resp, next) {
  // Tratar erros disparados pela regra de negocio
  if (error instanceof AppError) {
    return resp.status(error.statusCode).json({
      status: 'Erro_negocio',
      mensagem: error.message,
    });
  }

  //Tratar erros de validação Zod (Entrada de dados)
  if (error instanceof ZodError) {
    const detalhes = error.issues.map((issue) => ({
      campo: issue.path.join('.'),
      mensagem: issue.message,
    }));

    return resp.status(400).json({
      status: 'Erro Validação',
      menssagem: 'Dados fornecidos são invalidos',
      erros: detalhes,
    });
  }

  //Tratar erros conhecidos pelo prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //P2002: erro de campo dupliado
    if (error.code === 'P2002') {
      const duplicado = error.meta?.target;

      return resp.status(409).json({
        status: 'Conflito',
        mensagem: `O valor informado para o campo ${duplicado} já esta em uso`,
      });
    }

    if (error.code ==='P2025') {
      return resp.status(409).json({
        status: 'nao_encontrado',
        mensagem: `registro solicitado não foi encontrado na base de dados`,
      });
    }
  }

  return resp.status(500).json({
    status: "erro_servidor",
    mensagem:"Algum erro no servidor, Tente novamente"
  })
}
