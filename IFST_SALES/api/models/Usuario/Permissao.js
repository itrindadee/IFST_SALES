// api/models/Permissao.js
module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true,
      description: 'O nome da permissão, como "Gerenciar Usuários".'
    },

    // Descrição da permissão
    descricao: {
      type: 'string',
      required: true,
      description: 'Uma descrição detalhada da permissão e o que ela controla.'
    },

    // Tipo de permissão: Criar, Editar, Listar, Deletar, Buscar
    tipoPermissao: {
      type: 'string',
      isIn: ['Criar', 'Editar', 'Listar', 'Deletar', 'Buscar', 'Atualizar'],
      required: true,
      description: 'O tipo de permissão, como "Criar", "Editar", "Listar", "Deletar",  "Buscar", "Atualizar".'
    },
    perfils: {
      collection: 'perfil',
      via: 'permissoes'
    }
  }
};

