import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';

const router = Router();

router.get('/usuarios', usuarioController.listar);
router.post('/usuarios', usuarioController.criar);
export default router
