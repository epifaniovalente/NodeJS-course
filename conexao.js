import express from 'express';
import mysql from 'mysql2';

// conexao
const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0021',
  database: 'sistema_gestbi',
});

const app = new express();

app.get('/', (request, response) => {
  conexao.query('SELECT * FROM cidadaos', (err, result) => {
    response.send(result);
  });
});

app.listen('3030', () => {
  console.log('rodando');
});