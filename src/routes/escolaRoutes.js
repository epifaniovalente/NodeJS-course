import { Router } from 'express';
import { escolaController } from '../controllers/escolaController.js';

const escolaRota = Router();

escolaRota.get('/turmas/:id', escolaController.listar);
escolaRota.get('/turmas', escolaController.buscarTurmas);
escolaRota.get('/alunos', escolaController.buscarAlunos);

escolaRota.post('/alunos', escolaController.cadAluno);
escolaRota.post('/turmas', escolaController.cadTurma);

export default escolaRota;
