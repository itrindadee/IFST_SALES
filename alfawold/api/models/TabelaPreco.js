// api/models/TabelaPreco.js

module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true,
    },
    descricao: {
      type: 'string',
      required: true,
    },
    ativo: {
      type: 'boolean',
      defaultsTo: true,
    },
    itens: {
      collection: 'ItemTabelaPreco',
      via: 'tabelapreco',
    },
  },
};
