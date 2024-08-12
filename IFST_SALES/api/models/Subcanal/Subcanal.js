// api/models/Subcanal.js

module.exports = {
  attributes: {
    grupoConta: {
      type: 'string',
      required: true,
    },
    canal: {
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
    },
    ativo: {
      type: 'boolean',
      defaultsTo: true,
    }
  },
};
