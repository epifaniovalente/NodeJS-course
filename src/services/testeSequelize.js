import Sequelize from 'sequelize';

const conexao = new Sequelize('bancotest', 'root', '0021', {
  host: 'localhost',
  dialect: 'mysql',
});

conexao
  .authenticate()
  .then(function () {
    console.log('conecatado');
  })
  .catch(function (error) {
    console.log('algum erro' + error);
  });

const Postagem = conexao.define('postagens', {
  titulo: {
    type: Sequelize.STRING,
  },
  conteudo: {
    type: Sequelize.TEXT,
  },
});

// Postagem.sync({ force: true });
// Postagem.create({
//   titulo:"Qualquer Titulo",
//   conteudo: "kjhkhdahnlkvljdpokggrrn ekfhwoiuf efwoeufnds djpv cj"
// })

const Usuario = conexao.define('usuarios', {
  nome: {
    type: Sequelize.STRING,
  },
  sobrenome: {
    type: Sequelize.STRING,
  },
  idade: {
    type: Sequelize.INTEGER,
  },
  email: {
    type: Sequelize.STRING,
  },
});

// Usuario.sync({ force: true });
Usuario.create({
  nome:"Epifanio",
  sobrenome:"Alvaro",
  idade:23,
  email:"epi@gmail.co"
})

export default conexao;
