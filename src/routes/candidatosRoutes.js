import { Router } from 'express';
import candidatosController from '../controllers/candidatosController.js';
import { z } from 'zod';
import { candidatosService } from '../services/candidatosService.js';
import { prisma } from '../lib/prisma.js';

const validarDados = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 carcteres ' }),
  email: z.email({ message: 'digite um email valido' }),
  idade: z.number().int().positive({ message: 'insira uma idade valida' }),
});

const rotasCand = Router();

rotasCand.get('/candidatos', candidatosController.listarCandidatos);
rotasCand.post('/candidatos',  candidatosController.criarCandidato);
rotasCand.get('/candidatos/:id', candidatosController.buscarId);
rotasCand.delete('/candidatos/:id', candidatosController.apagarCandidato);

export default rotasCand;
