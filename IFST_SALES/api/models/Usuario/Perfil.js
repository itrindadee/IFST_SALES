// Perfil.js

module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true,
      unique: true,
      description: 'Nome do perfil de usuário.'
    },
    descricao: {
      type: 'string',
      description: 'Descrição do perfil de usuário.'
    },
    // Associação com Permissões
    permissoes: {
      collection: 'Permissao',
      via: 'perfilId',
      description: 'As permissões atribuídas a este perfil de usuário.',
      through: 'PerfilPermissao' // Use o nome da tabela intermediária
    }
  }
};
