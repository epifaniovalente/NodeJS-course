import jwt from 'jsonwebtoken';

function middlewareHelpdesk(req, res, next) {
  const token = req.cookies.token;

  // VERIFICA SE O TOKEN EXISTE
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado, faça login' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(403).json({ error: 'Chave de acesso invalida' });
  }
}

export default middlewareHelpdesk;
