import jwt from 'jsonwebtoken';

export function authMiddleware(req, resp, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split('')[1];

  if (!token) {
    return resp.status(401).json({message:'Acesso negado'})
  }

  try {
    const usuarioDescodificado = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = usuarioDescodificado;

    return next()
  } catch (error) {
    resp.status(403).json({message: 'Token invalido o exiprado'})
    
  }
}
