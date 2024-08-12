// api/models/FluxoAprovacao/Aprovador.js

module.exports = {
  attributes: {
    ordem: {
      type: 'number',
      required: true,
    },
    regra: {
      model: 'RegraAprovacao',
    },
    usuario: {
      model: 'User',
    },
  },
};
