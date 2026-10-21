import express from 'express'

const app = express()
app.use(express.json())

app.get('/',(req,resp)=>{
  resp.sendFile(__dirname + '/src/pages/index.html')
})

app.listen('3030',()=>{
  console.log("Servidor no ar, na porta: http://localhost:3030");
  
})