// api/models/Cliente.js
module.exports = {
  attributes: {
    razaoSocial: { type: 'string', required: true },
    termoPesquisa: { type: 'string' },
    cep: { type: 'string', allowNull: true },
    domicilio: { type: 'string', allowNull: true },
    rua: { type: 'string', allowNull: true },
    numero: { type: 'string', allowNull: true },
    complemento: { type: 'string', allowNull: true },
    bairro: { type: 'string', allowNull: true },
    cidade: { type: 'string', allowNull: true },
    regiao: { type: 'string', allowNull: true },
    fornecedor: { type: 'string', allowNull: true },
    grupoEmpresa: { type: 'string', allowNull: true },
    grupoConta: { type: 'string', required: true },
    cnpj: {
      type: 'string',
      allowNull: true,
    },
    cpf: {
      type: 'string',
      allowNull: true,
    },
    inscEstadual: { type: 'string', allowNull: true },
    inscMunicipal: { type: 'string', allowNull: true },
    ctgCFOP: { type: 'string', allowNull: true },
  },
 // empresas: {  // Este é o nome da coleção que você usará para acessar as empresas relacionadas.
 //   collection: 'clienteempresa',
 //   via: 'cliente'
 // },
 // organizacoesVendas: {  // Este é o nome da coleção que você usará para acessar as empresas relacionadas.
 //   collection: 'ClienteOrganizacaoVendas',
 //   via: 'cliente'
 // },
};
