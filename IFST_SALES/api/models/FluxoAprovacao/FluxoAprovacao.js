// api/models/FluxoAprovacao/FluxoAprovacao.js

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
    regras: {
      collection: 'RegraAprovacao',
      via: 'fluxo',
    },
  },
};
