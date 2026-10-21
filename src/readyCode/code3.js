// src/schemas/produtoSchema.js 
import { z } from 'zod'; 
 
export const criarProdutoSchema = z.object({ 
  body: z.object({ 
    nome: z 
      .string({ required_error: 'O nome é obrigatório.' }) 
      .min(3, 'O nome do produto deve ter pelo menos 3 caracteres.') 
      .trim(), 
    preco: z 
      .number({ required_error: 'O preço é obrigatório.' }) 
      .positive('O preço deve ser um valor positivo maiores que 0.') 
  }) 
}); 
 
export const atualizarProdutoSchema = z.object({ 
  params: z.object({ 
    id: z.string().uuid('O ID fornecido na URL deve ser um UUID válido.') 
  }), 
  body: z.object({ 
    nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.').optional(), 
    preco: z.number().positive('O preço deve ser positivo.').optional() 
  }) 
}); 