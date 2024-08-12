// api/models/OrganizacaoVendas.js

module.exports = {

  attributes: {
    nome: {
      type: 'string',
      required: true
    },
    descricao: {
      type: 'string',
    },
    codigo: {
      type: 'string',
      required: true,
      unique: true
    },
    ativo: {
      type: 'boolean',
      defaultsTo: true
    },
     // Associação com Clientes
     clientes: {
      collection: 'cliente',
      via: 'organizacaoVendas'
    }
  }
};
