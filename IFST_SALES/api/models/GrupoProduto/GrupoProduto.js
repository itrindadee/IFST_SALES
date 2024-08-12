// api/models/GrupoDeProduto.js

module.exports = {
  attributes: {
    codigo: {
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
    }
  },
};
