import { Router } from "express";
import { controllerHelpdesk } from "../controllers/controllerHelpdesk.js";
import middlewareHelpdesk from "../middleware/HelpdeskMiddleware.js";
import { authHelpdesk } from "../auth/authHelpesk.js";

const routesHelpdesk = Router()

routesHelpdesk.post('/helpdesk/auth/login', authHelpdesk.entrar)

routesHelpdesk.use(middlewareHelpdesk)
// CADASTRO DE CLIENTE OU ADMIN/TECNICO
routesHelpdesk.post('/helpdesk/auth/singup', authHelpdesk.cadastrar)
// CRIAR CHAMADO
routesHelpdesk.post('/helpdesk/chamados',controllerHelpdesk.createChamdo)
// LISTA DE CHAMADO
routesHelpdesk.get('/helpdesk/chamados', controllerHelpdesk.getChamados)
// DETALHES DO CHAMADO
routesHelpdesk.get('/helpdesk/detalhes/:chamadoID', controllerHelpdesk.getDetalheChamado)
// LOGOUT
routesHelpdesk.get('/helpdesk/auth/logout', authHelpdesk.logout)
// RECUPERAR SESSAO
routesHelpdesk.get('/helpdesk/auth/me', authHelpdesk.getSessao)



export default routesHelpdesk