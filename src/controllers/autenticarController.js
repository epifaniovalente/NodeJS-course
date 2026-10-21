import { autenticarService } from '../services/autenticarService';

export const authController = {
  async login(req, resp) {
    const { email, senha } = req.body;
    //disparar autenticação
    const resultadoLogin = await autenticarService.entrar({ email, senha });

    return resp.status(200).json(resultadoLogin);
  },
  
};
