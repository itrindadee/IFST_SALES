// api/models/Regiao.js

module.exports = {
  attributes: {
    organizacaoVendas: {
      type: 'string',
      required: true,
    },
    codigo: {
      type: 'string',
      required: true,
    },
    descricao: {
      type: 'string',
      required: true,
    }
  },
};
