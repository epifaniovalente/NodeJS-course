import { Router } from 'express';
import { authService } from '../services/authService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const rotasAuth = Router();

// Rota Pública para cadastro
rotasAuth.post('/auth/cadastro', async (req, resp) => {
  try {
    const usuario = await authService.cadastro(req.body);
    return resp.status(201).json(usuario);
  } catch (error) {
    return resp.status(400).json({ messagem: error.message });
  }
});

// Rota Pública para login
rotasAuth.get('/auth/login', async (req, resp) => {
  try {
    const consulta = await authService.login(req.body);
    return resp.status(200).json(consulta);
  } catch (error) {
    resp.status(401).json({ messagem: error.message });
  }
});


// Rota protegida
rotasAuth.get('/perfil', authMiddleware, async(req, resp)=>{
  return resp.status(200).json({
    mensagem: "Passou a uma rota protegida com sucesso",
    userLogado: req.usuario
  })
})

export default rotasAuth