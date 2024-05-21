// api/models/ItemTabelaPreco.js

module.exports = {
  attributes: {
    descricao: {
      type: 'string',
      required: true,
    },
    preco: {
      type: 'number',
      required: true,
    },
    tabelapreco: {
      model: 'TabelaPreco',
    },
  },
};
