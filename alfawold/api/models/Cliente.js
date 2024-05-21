/**
 * Clientes.js
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
    empresa: {
      model: 'Empresa',
      required: true
    },
    organizacaoVendas: {
      model: 'organizacaoVendas',
      required: true
    },
    razaoSocial: {
      type: 'string',
      required: true
    },
    tipoCliente: {
      type: 'string',
      required: true
    },
    cnpj: {
      type: 'string',
      allowNull: true
    },
    cpf: {
      type: 'string',
      allowNull: true
    },
    inscMunicipal: {
      type: 'string',
      allowNull: true
    },
    inscEstadual: {
      type: 'string',
      allowNull: true
    },
    transportadora: {
      type: 'string',
      allowNull: true
    },
    diasParaExpedicao: {
      type: 'number',
      allowNull: true
    },
    distrito: {
      type: 'string',
      allowNull: true
    },
    comissao: {
      type: 'number',
      allowNull: true
    },
    despesasBancarias: {
      type: 'number',
      allowNull: true
    },
    prazoPagamento: {
      type: 'string',
      allowNull: true
    },
    meioTransporte: {
      type: 'string',
      allowNull: true
    },
    moeda: {
      type: 'string',
      allowNull: true
    },
    pais: {
      type: 'string',
      allowNull: true
    },
    representante: {
      type: 'string',
      allowNull: true
    },
    desconto: {
      type: 'number',
      allowNull: true
    },
    rua: {
      type: 'string',
      allowNull: true
    },
    rua2: {
      type: 'string',
      allowNull: true
    },
    rua3: {
      type: 'string',
      allowNull: true
    },
    bairro: {
      type: 'string',
      allowNull: true
    },
    cep: {
      type: 'string',
      allowNull: true
    },
    cidade: {
      type: 'string',
      allowNull: true
    },
    numero: {
      type: 'string',
      allowNull: true
    },
    complemento: {
      type: 'string',
      allowNull: true
    },
    observacaoEndereco: {
      type: 'string',
      allowNull: true
    },
    uf: {
      type: 'string',
      allowNull: true
    }
  }
};
