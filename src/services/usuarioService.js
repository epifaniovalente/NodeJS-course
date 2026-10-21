// banco de dados

const candidatos = [];

export const usuarioService = {
  // funcão para listar todo candidatos
  lisarTodos() {
    return candidatos;
  },

  // Função para adicionar novo candidato
  criar(dados) {
    const novoCandidato = {
      id: candidatos.length + 1,
      ...dados,
    };

    candidatos.push(novoCandidato);
    return novoCandidato;
  },
};
