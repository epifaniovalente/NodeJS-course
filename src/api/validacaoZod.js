import express from "express";
import { z } from "zod";


const app = express()

app.use(express.json())

const validateData = z.object ({
  nome: z.string({ required_error: "O nome é obrigatório" }).min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string({ required_error: "O email é obrigatório" }).email({ message: "O email deve ser válido" }),
  idade: z.number({ required_error: "A idade é obrigatória" }).int().positive({ message: "A idade deve ser um número inteiro positivo" }),
})

const usuarios = []

app.post("/usuarios", (req, res) => {
  const resultado = validateData.safeParse(req.body)

  if (!resultado.success) {
    const errosFormatados= resultado.error.issues.map((issue)=>{
      return {
        campo: issue.path[0],
        mensagem: issue.message
      }
    })
    return res.status(400).json({ errors: errosFormatados })
  }

  usuarios.push(resultado.data)
  res.status(201).json({ message: "Usuário criado com sucesso" })
})

app.get('/usuarios',(req,resp)=>{
  
  resp.status(200).json(usuarios)
})

app.listen(3030,()=>{
  console.log("Servidor no AR!");
})
