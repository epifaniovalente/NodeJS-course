import jwt from 'jsonwebtoken';

export function ensureAuthenticated(req, res, next) {
  // 1. Captura o cabeçalho 'Authorization' da requisição HTTP
  const authHeader = req.headers.authorization;

  // Se o cabeçalho não foi enviado
  if (!authHeader) {
    return res
      .status(401)
      .json({ mensagem: 'Token de autenticação não fornecido.' });
  }

  // O formato esperado do cabeçalho é: "Bearer <TOKEN_JWT_AQUI>"
  // Usamos o split(' ') para separar a palavra "Bearer" da string do token
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ mensagem: 'Erro no formato do Token.' });
  }

  const [scheme, token] = parts;

  // Valida se o prefixo é exatamente "Bearer"
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ mensagem: 'Token malformatado.' });
  }

  // 2. Valida o Token JWT usando a Chave Secreta da aplicação
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. INJEÇÃO DOS DADOS DO USUÁRIO NA REQUISIÇÃO (req.user):
    // Armazenamos o ID e a Role do payload do token no próprio objeto 'req'
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    // Autoriza a requisição a prosseguir para o Controller
    return next();
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

// ========== CONTROLLER =============
// no Controller nao mais precisamos pedir o ID do usuário na URL ou no corpo da requisição; pegamos direto do req.user.id:
// src/controllers/chamadoController.js
export const chamadoController = {
  async criar(req, res) {
    const { titulo, descricao } = req.body;
    // O id do cliente vem do token validado no middleware!
    const clienteId = req.user.id;
  },
};

// ===========================================
// ============ USANDO Set-Cookie ============
// ===========================================

// APP / SERVER
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());

// 1. O cookie-parser transforma o cabeçalho 'Cookie' da requisição no objeto JS: req.cookies
app.use(cookieParser());

// 2. O CORS PRECISA autorizar credenciais (cookies) do endereço do seu React
app.use(
  cors({
    origin: 'http://localhost:5173', // URL do Front-end em React (Vite)
    credentials: true, // PERMITE a troca de cookies
  })
);

// ========= MIDDLEWARE DE VERIFICAÇÃO DE ROLE =============
// JavaScript
// Recebe uma lista de papéis permitidos (ex: ['ADMIN', 'GERENTE'])
export function checkRole(rolesPermitidas = []) {
  return (req, res, next) => {
    // req.user foi injetado pelo middleware ensureAuthenticated anterior
    if (!req.user) {
      return res.status(401).json({ mensagem: 'Usuário não identificado.' });
    }
    const { role } = req.user;
    // Se o tipo do usuário não estiver na lista autorizada
    if (!rolesPermitidas.includes(role)) {
      return res.status(403).json({});
    }
  };
}
// ========= MIDDLEWARE DE VERIFICAÇÃO =============

export function ensureAuthenticated(req, res, next) {
  // 1. Lê o cookie 'token' enviado AUTOMATICAMENTE pelo navegador
  const token = req.cookies.token;

  // Se o cookie não existir, o usuário não está autenticado
  if (!token) {
    return res
      .status(401)
      .json({ mensagem: 'Acesso negado. Faça login para continuar.' });
  }

  try {
    // 2. Valida a assinatura do token JWT com a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Injeta o ID e o Papel (Role) do usuário no objeto 'req'
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ mensagem: 'Sessão expirada ou token inválido.' });
  }
}

// ========== CONTROLLER AUTH ====================

import jwt from 'jsonwebtoken';
export const authController = {
  // --- LOGIN ---
  async login(req, res) {
    const { email, senha } = req.body;
    // (Validação do usuário e senha omitidas para simplificar)
    const usuario = { id: 'usr-123', nome: 'EpiCoder', role: 'CLIENTE' };
    // Criar o token JWT
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Grava o Cookie HttpOnly no navegador
    return res
      .cookie('token', token, {
        httpOnly: true, // O JS no navegador NÃO consegue ler (protege contra XSS)
        secure: process.env.NODE_ENV === 'production', // 'true' apenas em HTTPS
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // Expira em 1 dia
      })
      .json({ usuario });
  },

  // --- LOGOUT ---
  async logout(req, res) {
    // 1. Opcional: Se você quiser registrar um log do usuário que deslogou
    // (Pode usar o middleware de autenticação na rota de logout para preencher req.user)
    if (req.user) {
      console.log(`O usuário ${req.user.id} encerrou a sessão.`);
    }

    // 2. Apaga o cookie 'token' no navegador do cliente
    return res
      .clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ mensagem: 'Sessão encerrada com sucesso.' });
  },

  // --- ME (Retorna os dados do usuário autenticado no F5) ---
  async me(req, res) {
    // req.user já possui id e role vindos do middleware
    const usuario = usuariosDB.find((u) => u.id === req.user.id);

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    return res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    });
  },
};

// =========== API FRONT =============

import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://localhost:3300/api',
  withCredentials: true, // OBRIGATÓRIO: Força o navegador a anexar e aceitar cookies da API
});

// ========= STORE ZUSTAND ============

import { create } from 'zustand';
import { api } from '../services/api';
export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // Login
  signIn: async ({ email, senha }) => {
    const resposta = await api.post('/auth/login', { email, senha });
    // O cookie já foi gravado pelo navegador automaticamente na resposta
    set({ user: resposta.data.usuario });
  },
  // Logout
  signOut: async () => {
    try {
      // Chama a rota que responde com res.clearCookie('token')
      await api.post('/auth/logout');
    } finally {
      // Limpa os dados do usuário no estado do React
      set({ user: null });
    }
  },
  // Checar se o cookie continua válido ao recarregar a página (F5)
  carregarSessao: async () => {
    try {
      set({ loading: true });
      const resposta = await api.get('/auth/me'); // Rota protegida no Express
      set({ user: resposta.data.usuario });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));
