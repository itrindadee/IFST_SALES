// api/models/Perfil.js
module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true,
      unique: true
    },
    descricao: {
      type: 'string'
    },
    permissoes: {
      collection: 'permissao',
      via: 'perfils',
      dominant: true
    },
    usuarios: {
      collection: 'user',
      via: 'perfil'
    }
  }
};
