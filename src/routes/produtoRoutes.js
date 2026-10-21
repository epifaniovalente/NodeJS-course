import { Router } from 'express';
import { produtoController } from '../controllers/produtoControlles.js';

const rotaProdutos = Router();
rotaProdutos.post('/produtos', produtoController.Cadastrar);
rotaProdutos.get('/produtos', produtoController.Buscar);
rotaProdutos.delete('/produtos/:id', produtoController.deletar);
rotaProdutos.put('/produtos/:id', produtoController.atualizar);


export default rotaProdutos;
