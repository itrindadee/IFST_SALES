// api/models/IntegrationConfig.js
module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true
    },
    endpoint: {
      type: 'string',
      required: true
    },
    metodo: {
      type: 'string',
      isIn: ['GET', 'POST', 'PUT', 'DELETE'],
      required: true
    },
    headers: {
      type: 'json',
      defaultsTo: {}
    },
    payload: {
      type: 'json',
      defaultsTo: {}
    },
    ativo: {
      type: 'boolean',
      defaultsTo: true
    }
  }
};
