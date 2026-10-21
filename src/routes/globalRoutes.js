import { Router } from "express";
import { authGlobal } from "../auth/authGlobal.js";
import { clientesGlobalController } from "../controllers/clientesGlobalController.js";
import { globalMiddleware } from "../middleware/globalMiddleware.js";

const globalRoutes = Router()

// ROTAS PUBLICAS
globalRoutes.post('/auth/login', authGlobal.login)
globalRoutes.post('/auth/singin', authGlobal.cadastrar)

// ROTAS PRIVADAS
globalRoutes.get('/clientes', globalMiddleware, clientesGlobalController.readyClientes)
globalRoutes.put('/clientes/:id', globalMiddleware, clientesGlobalController.updateCliente)

export default globalRoutes