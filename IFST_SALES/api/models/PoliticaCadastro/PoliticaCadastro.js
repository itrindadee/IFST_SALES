/**
 * PoliticaCadastro.js
 *
 * @description :: Um modelo que representa uma política de cadastro.
 */

module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true,
    },
    ativo: {
      type: 'boolean',
      defaultsTo: true,
    },
    campoResultado: {
      type: 'string',
      required: true,
    },
    valorResultado: {
      type: 'string',
      required: true,
    },
    condicoes: {
      collection: 'CondicaoCadastro',
      via: 'politicaCadastro',
    },
  },
};
