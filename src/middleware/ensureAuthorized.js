import jwt from 'jsonwebtoken';

export function ensureAuthorized(req, resp, next) {
  const token = req.cookie.token;

  if (!token) {
    return resp.status(401).json({ message: 'Acesso negado, Faça login' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      cidade: decoded.Cidade,
    };

    return next();
  } catch (error) {
    return resp
      .status(401)
      .json({ message: 'Sessão expirada ou token invalido.' });
  }
}
