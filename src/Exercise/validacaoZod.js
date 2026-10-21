import z, { safeParse } from 'zod';
import express from 'express';

const app = express();
app.use(express.json());

// Banco de dados em memoria(Simulação)
const clientes = [];

// 1º - Criar o esquema de valização Zod
const validarDados = z.object({
  nome: z
    .string({ required_error: 'nome é obrigatório' })
    .min(3, { message: 'deve ter pelo menos 3 caracteres' }),
  email: z.email({ message: 'email é obrigatorio' }),
  telefone: z
    .number({ required_error: 'telefone é obrigatorio' }).int().min(9, { message: 'deve ter pelo menos 9 numeros' }),
});

app.post('/clientes', (req, resp) => {
  const resultadoCliente = validarDados.safeParse(req.body)
  if (!resultadoCliente.success) {
    const errosFormat = resultadoCliente.error.issues.map((issue) => {
      return {
        campo: issue.path[0],
        erro: issue.message,
      };
    });

    return resp.status(400).json({
      erros: errosFormat,
      mensagem: 'Erro na validação de dados',
    });
  }

  // Caso passe na validação criamos o objecto de dados do cliente
  const novoCliente ={
    id: clientes.length +1,
    ...resultadoCliente.data
  }

  //adicionamos à base de dados
  clientes.push(novoCliente)

  return resp.status(201).json('Cliente adicionado com sucesso')
});

app.get('/clientes',(req,resp)=>{
  resp.status(200).json(clientes)
})

app.listen('3030', () => {
  console.log('Servidor no Ar!');
});
