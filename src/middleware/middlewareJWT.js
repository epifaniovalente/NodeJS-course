import jwt from "jsonwebtoken";

function middlewareJWT(req,resp,next) {
  //1º pegar o header do token
  const authHeader = req.headers['authorization']
  //2º pegar somente o token no header recebido
  const token = authHeader?.split(' ')[1]

  //3º verifica se o token existe
  if (!token) {
    return resp.sendStatus(401)
  }

  //4º Caso o token exista, verificamos se não foi manipulada de acordo a chave criada ()
  jwt.verify(token, process.env.JWT_SECRET, (error, usuarioLog)=>{
    if (error) {
      return resp.sendStatus(401)
    }

    req.usuario = usuarioLog
    next()
  })

}

export default middlewareJWT