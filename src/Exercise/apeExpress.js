import express from 'express';

const app = express();

// a seguir dizemos ao express entender(use) JSON vindo do corpo de requisição
app.use(express.json());

// 2º Base de dados (Simulação)
const usuarios = [
  { id: 12, nome: 'Agnaldo', email: 'agnaldo@email.com' },
  { id: 13, nome: 'Anastacia', email: 'anastacia@email.com' },
  { id: 14, nome: 'António', email: 'antonio@email.com' },
];

// 1ª Rota -  GET para listar usuarios ou filtrar por nome
app.get('/users', (req, resp) => {
  const { userFiltro } = req.query;

  if (userFiltro) {
    const usersEncontrados = usuarios.filter((user) =>
      user.nome.toLocaleLowerCase().includes(userFiltro.toLocaleLowerCase())
    );
    return resp.status(200).json(usersEncontrados);
  }

  return resp.status(200).json(usuarios);
});


// 2ª Rota - GET buscar usuario atraves do ID
app.get('/users/:id', (req, resp) => {
  const { id } = req.params;
  const usuario = usuarios.filter((u) => u.id === Number(id));
  if (!usuario) {
    return resp.status(404).json({ message: 'Usuario não encontrado!' });
  }
  return resp.status(200).json(usuario);
});

/*3ª ROTA - POST enviar dados vindo da requisiçaõ do usuario */
app.post('/users', (req,resp)=>{
  const {nome, email}=req.body

  if (!nome || !email) {
    return resp.status(400).json({message: "Os campos nome e email são obrigatório"})
  }
  const novoUser ={
    id: usuarios.length +1,
    nome,
    email
  }
  usuarios.push(novoUser)

  return resp.status(201).json(novoUser.nome)
})

// EXECUTANDO O SERVIDOR NA PORTA 3030
app.listen('3030', () => {
  console.log('Servidor no Ar!');
});