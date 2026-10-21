/ =========================================
// ========== TESTE AUTOMATIZADO ===========
// =========================================

import { describe, it, expect } from 'vitest'; 
import { calcularDesconto } from './descontoService.js'; 
 
describe('Serviço de Cálculo de Desconto', () => { 
 
  it('não deve aplicar desconto para compras abaixo de 10.000 Kz', () => { 
    const desconto = calcularDesconto(5000); 
     
    // Esperamos que o desconto seja exatamente 0 
    expect(desconto).toBe(0); 
  }); 
 
  it('deve aplicar 10% de desconto para compras entre 10.000 Kz e 50.000 Kz', () => { 
    const desconto = calcularDesconto(20000); 
     
    // 10% de 20.000 é 2.000 
    expect(desconto).toBe(2000); 
  }); 
 
  it('deve aplicar 20% de desconto para compras acima de 50.000 Kz', () => { 
    const desconto = calcularDesconto(100000); 
     
    // 20% de 100.000 é 20.000 
    expect(desconto).toBe(20000); 
  }); 
 
  it('deve disparar um erro se o valor da compra for zero ou negativo', () => { 
    // Para testar erros/exceções no Vitest, passamos uma função anônima para o expect 
    expect(() => calcularDesconto(-500)).toThrow("O valor da compra deve ser maior que zero."); 
  }); 
 
});