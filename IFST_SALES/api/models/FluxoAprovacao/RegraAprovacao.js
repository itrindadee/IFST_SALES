// api/models/FluxoAprovacao/RegraAprovacao.js

module.exports = {
  attributes: {
    nivel: {
      type: 'number',
      required: true,
    },
    tipo: {
      type: 'string',
      isIn: ['AND', 'OR'],
      required: true,
    },
    fluxo: {
      model: 'FluxoAprovacao',
    },
    aprovadores: {
      collection: 'Aprovador',
      via: 'regra',
    },
  },
};
