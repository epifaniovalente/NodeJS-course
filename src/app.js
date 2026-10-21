import express from 'express';
import rotaProdutos from './routes/produtoRoutes.js';
// import conexao from './services/testeSequelize.js';
// import servidor from '../server.js';
// import router from './routes/usuarioRoutes.js';
// import rotasCand from './routes/candidatosRoutes.js';
// import escolaRota from './routes/escolaRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import serverAuthToken from './auth/authJWT.js';
// import rotasAuth from './routes/authRoutes.js';
import globalRoutes from './routes/globalRoutes.js';
import routesHelpdesk from './routes/routesHelpdesk.js';

const app = express();
// USAR ROTAS
app.use(express.json());
// USAR COOKIES
app.use(cookieParser());


app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);


//registra rotas
// app.use(rotasCand)
// app.use(escolaRota)
// app.use(rotaProdutos);
// app.use(serverAuthToken)
// app.use(rotasAuth)
// app.use(globalRoutes);
app.use(routesHelpdesk);

// app.get('/',(req,resp)=>{
//   resp.sendFile(__dirname() + '/src/pages/index.html')
// })

app.listen('3030', () => {
  console.log('servidor Online!');
});