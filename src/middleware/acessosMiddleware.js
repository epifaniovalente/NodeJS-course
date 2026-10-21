export function acessosMiddleware(acessosPermitidos = []) {
  return (req, res, next) => {
    const { role } = req.user;
    if (!acessosPermitidos.includes(role)) {
      return res
        .status(403)
        .json({
          message: 'Acesso Negado: Não tem acesso para realizar esta ação',
        });
    }
    return next();
  };
}
