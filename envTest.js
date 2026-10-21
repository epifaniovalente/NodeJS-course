import 'dotenv/config' // carrega as variaveis do arquivo .env


const porta = process.env.PORT || 8080
const appName = process.env.NOME_APLICACAO;

console.log(`${appName} configurada na porta: ${porta}`);
