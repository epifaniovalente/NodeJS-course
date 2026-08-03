// import { createServer } from "node:http";

// const server = createServer((req, res) => {
//   console.log('Hello, world!');
//   return res.end()
// });

// server.listen(3097)

import { fastify } from 'fastify';


const server = fastify();

server.get('/', () => {
  return 'Hello, Home Page';
});

server.get('/hello', () => {
  return 'Hello, Hello page';
});

server.get('/node', () => {
  return 'Hello, Node Page';
});

// console.log(soma(13, 4));

server.listen({
  port: 3097,
});
