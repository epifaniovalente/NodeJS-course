import { prisma } from '../lib/prisma.js';

export async function deletarUsuarioAuditoria(userId) {
  //Pass amos um array de promise

  const [usuarioDeletado, logCriado] = await prisma.$transaction([
    
    //Operacao A:
    prisma.user.delete({
      where:{
        id:Number(userId)
      }
    }),

    //Operação B:
    prisma.auditoria.create({
      data:{acao:`O Usuario ${userId} foi removido`}
    })

  ])

  return usuarioDeletado
}
