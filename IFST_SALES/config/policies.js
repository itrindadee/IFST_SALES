/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const ClienteController = require("../api/controllers/Cliente/ClienteController")

module.exports.policies = {
  // Políticas de autorização para o módulo Canal
 '*': 'is-logged-in',

 PerfilController: {
  '*': 'autorizacaoPerfil',
},

  CanalController: {
    '*': 'autorizacaoCanal',
  },

  // Políticas de autorização para o módulo Categoria
  CategoriaController: {
    '*': 'autorizacaoCategoria',
  },

  // Políticas de autorização para o módulo Cliente
  ClienteController: {
    '*': 'autorizacaoCliente',
  },

  // Políticas de autorização para o módulo Empresa
  EmpresaController: {
    '*': 'autorizacaoEmpresa',
  },

  // Políticas de autorização para o módulo Equipe de Vendas
  EquipeVendasController: {
    '*': 'autorizacaoEquipeVendas',
  },

  // Políticas de autorização para o módulo Escritório de Vendas
  EscritorioVendasController: {
    '*': 'autorizacaoEscritorioVendas',
  },

  // Políticas de autorização para o módulo Fluxo de Aprovação
  FluxoAprovacaoController: {
    '*': 'autorizacaoFluxoAprovacao',
  },

  // Políticas de autorização para o módulo Grupo de Conta
  GrupoContaController: {
    '*': 'autorizacaoGrupoConta',
  },

  // Políticas de autorização para o módulo Grupo Empresa
  GrupoEmpresaController: {
    '*': 'autorizacaoGrupoEmpresa',
  },

  // Políticas de autorização para o módulo Grupo Produto
  GrupoProdutoController: {
    '*': 'autorizacaoGrupoProduto',
  },

  // Políticas de autorização para o módulo Marca
  MarcaController: {
    '*': 'autorizacaoMarca',
  },

  // Políticas de autorização para o módulo Organização de Vendas
  OrganizacaoVendasController: {
    '*': 'autorizacaoOrganizacaoVendas',
  },

  // Políticas de autorização para o módulo Perfil

  // Políticas de autorização para o módulo Permissão
  PermissaoController: {
    '*': 'autorizacaoPermissao',
  },

  // Políticas de autorização para o módulo Política de Cadastro
  PoliticaCadastroController: {
    '*': 'autorizacaoPoliticaCadastro',
  },

  // Políticas de autorização para o módulo Produto
  ProdutoController: {
    '*': 'autorizacaoProduto',
  },

  // Políticas de autorização para o módulo Região
  RegiaoController: {
    '*': 'autorizacaoRegiao',
  },

  // Políticas de autorização para o módulo Sub Canal
  SubCanalController: {
    '*': 'autorizacaoSubCanal',
  },

  // Políticas de autorização para o módulo Sub Categoria
  SubCategoriaController: {
    '*': 'autorizacaoSubCategoria',
  },

  // Bypass the `is-logged-in` policy for:
  'entrance/*': true,
  'account/logout': true,
  'view-homepage-or-redirect': true,
  'view-faq': true,
  'view-contact': true,
  'legal/view-terms': true,
  'legal/view-privacy': true,
  'deliver-contact-form-message': true,
  'Cliente/Cliente/criar': 'aplicarPoliticaCadastro',
};
