// Permissao.js

module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true,
      description: 'Nome da permissão.',
      maxLength: 120,
      example: 'VisualizarClientes'
    },
    descricao: {
      type: 'string',
      description: 'Descrição da permissão.',
      maxLength: 250,
      example: 'Permite visualizar os clientes cadastrados no sistema.'
    },
    // Associação com Perfis
    perfil: {
      collection: 'Perfil',
      via: 'permissaoId',
      through: 'PerfilPermissao' // Use o nome da tabela intermediária
    }
  }
};
