export function calcularDesconto(valorTotal) { 
  if (valorTotal <= 0) { 
    throw new Error("O valor da compra deve ser maior que zero."); 
  } 
 
  if (valorTotal >= 10000 && valorTotal <= 50000) { 
    return valorTotal * 0.10; // 10% 
  } 
 
  if (valorTotal > 50000) { 
    return valorTotal * 0.20; // 20% 
  } 
 
  return 0; // Sem desconto 
}