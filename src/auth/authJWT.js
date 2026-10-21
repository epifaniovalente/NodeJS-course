import jwt from 'jsonwebtoken';
import express from 'express';
import middlewareJWT from '../middleware/middlewareJWT.js';


const serverAuthToken = express();
serverAuthToken.use(express.json());


const users = [{ id: 1, userName: 'Gustavo', passWord: '1234' }];

serverAuthToken.post('/login', (request, response) => {
  //1º receber os adados enviados
  const { userName, password } = request.body;
  //2º Validar as credenciais
  const user = users.find(
    (u) => u.userName === userName && u.passWord === password
  );

  //3º verificar o resultado da verificação dos dados
  if (!user) {
    return response.status(401).json({ message: 'Credenciais invalidas' });
  }

  //4º Gerar o Token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return response.status(200).json(token);

});

serverAuthToken.get('/protegida',middlewareJWT, (request,response)=>{
  response.json({message:"Rota protegida acessada!"})
})

serverAuthToken.listen('3030', () => {
  console.log('Servidor no ar!');
});


export default serverAuthToken