import jwt from 'jsonwebtoken';

export function globalMiddleware(req, resp, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return resp.status(401).json({ message: 'Acesso Negado, Faça Login' });
  }

  try {
    const userPermitido = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = userPermitido;

    next();
  } catch (error) {
    resp.status(403).json({ message: 'Chave de acesso invalida' });
  }
}
