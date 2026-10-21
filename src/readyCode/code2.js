
// src/middlewares/validate.js 
export function validate(schema) { 
return async (req, res, next) => { 
    // parseAsync lança uma exceção (ZodError) se a validação falhar. 
    // Usamos req.body, req.params ou req.query conforme o que estiver no schema. 
    const validatedData = await schema.parseAsync({ 
      body: req.body, 
      query: req.query, 
      params: req.params, 
    }); 
 
    // Sobrescrevemos as propriedades com os dados limpos e convertidos pelo Zod 
    req.body = validatedData.body; 
    req.params = validatedData.params; 
    req.query = validatedData.query; 
 
    return next(); 
  }; 
} 