/**
 * CondicaoCadastro.js
 *
 * @description :: Um modelo que representa uma condição de política de cadastro.
 */

module.exports = {
  attributes: {
    campo: {
      type: 'string',
      required: true,
    },
    operador: {
      type: 'string',
      required: true,
    },
    valor: {
      type: 'string',
      required: true,
    },
    politicaCadastro: {
      model: 'PoliticaCadastro',
      required: true,
    },
  },
};
