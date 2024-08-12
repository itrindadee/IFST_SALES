// api/models/Canal.js
module.exports = {
  attributes: {
    grupoConta: {
      type: 'string',
      required: true
    },
    codigo: {
      type: 'string',
      required: true,
      unique: true
    },
    descricao: {
      type: 'string',
      required: true
    },
    ativo: {
      type: 'boolean',
      defaultsTo: true
    }
  }
};
