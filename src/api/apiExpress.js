import express from 'express';

const app = express();

// middleware obrigatorio para o express entender JSON no corpo das requisiçoes (ex.: req.body)
app.use(express.json());

// SIMULAÇÃO DE UM BANCO DE DADOS
const candidatos = [
  { id: 1, nome: 'Epifanio', cargo: 'Dev FullStack Júnior', morada: 'Luanda' },
  { id: 2, nome: 'Lúcio', cargo: 'Dev BackEnd Senior', morada: 'Moxico' },
  { id: 3, nome: 'Carlos', cargo: 'UI/UX Design', morada: 'Benguela' },
  { id: 4, nome: 'Augusto', cargo: 'Base de Dados', morada: 'Bengo' },
];

// 1º Rota GET - Listar todos os usuarios ou filtrar via Query Params
// (ex.: /candidato?cargo=backend)
app.get('/candidatos', (req, resp) => {
  const { cargo } = req.query;

  if (cargo) {
    const filtrados = candidatos.filter((cand) =>
      cand.cargo.toLocaleLowerCase().includes(cargo.toLocaleLowerCase())
    );
    return resp.status(200).json(filtrados);
  }

  return resp.status(200).json(candidatos);
});

/* 2º Rota GET - Buscar buscar candidatos por ID via Route Params 
(ex.: /candidatos/1) */

app.get('/candidatos/:id', (req, resp) => {
  const { id } = req.params;

  const candidato = candidatos.filter((cand) => cand.id === Number(id));
  if (!candidato) {
    return resp.status(404).json({ message: 'Candidato não encontrado' });
  }

  return resp.status(200).json(candidato);
});

// 3º Rota POST - criar novo candidato via Body Params
app.post('/candidatos', (req, resp) => {
  const { nome, cargo, morada } = req.body;

  if (!nome || !cargo || !morada) {
    return resp
      .status(400)
      .json({ message: 'Os campos nome, cargo e morada são obrigatório' });
  }

  const novoCandidato = {
    id: candidatos.length + 1,
    nome,
    cargo,
    morada,
  };

  candidatos.push(novoCandidato);

  return resp.status(201).json(novoCandidato.nome);
});

// PARA inicializar o servidor

app.listen(3030, () => {
  console.log('Servidor no Ar!');
});
