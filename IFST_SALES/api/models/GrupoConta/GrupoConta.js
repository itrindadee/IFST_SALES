/**
 * GrupoConta.js
 *
 * @description :: Um modelo que representa um Grupo Conta.
 */

module.exports = {
  attributes: {
    codigo: {
      type: 'string',
      required: true,
      unique: true
    },
    descricao: {
      type: 'string',
      required: true
    }
  }
};
