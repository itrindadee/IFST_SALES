/**
 * Empresa.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    codigo: {
      type: 'string',
      required: true,
      unique: true
    },
    razaoSocial: {
      type: 'string',
      required: true
    },
    cnpj: {
      type: 'string',
      required: true,
      unique: true
    },
    endereco: {
      type: 'string'
    },
    // Associação com Clientes
    clientes: {
      collection: 'cliente',
      via: 'empresa'
    }
  }
};
