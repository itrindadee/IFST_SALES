/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const { policies } = require("./policies");

module.exports.routes = {

  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  'GET /':                        { action: 'view-homepage-or-redirect' },
  'GET /login':                   { action: 'entrance/view-login' },
  'GET /welcome/:unused?':        { action: 'dashboard/view-welcome' },

  'GET /faq':                { action:   'view-faq' },
  'GET /legal/terms':        { action:   'legal/view-terms' },
  'GET /legal/privacy':      { action:   'legal/view-privacy' },
  'GET /contact':            { action:   'view-contact' },

  'GET /signup':             { action: 'entrance/view-signup' },
  'GET /email/confirm':      { action: 'entrance/confirm-email' },
  'GET /email/confirmed':    { action: 'entrance/view-confirmed-email' },

  'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  'GET /password/new':       { action: 'entrance/view-new-password' },

  'GET /account':            { action: 'account/view-account-overview' },
  'GET /account/password':   { action: 'account/view-edit-password' },
  'GET /account/profile':    { action: 'account/view-edit-profile' },

//Crud Clientes
'GET /clientes/validar/:cpf?/:cnpj?/:empresa?/:organizacaoVendas?': { action: 'Cliente/cliente/validarcliente' },
'GET /clientes/renderizarcadastro':        { action: 'Cliente/cliente/renderizarCadastro'},
'GET /clientes/listar':                    { action: 'Cliente/cliente/listar' },
'GET /clientes/editar/:id':                { action: 'Cliente/cliente/editar'},
'POST /clientes':                          { action: 'Cliente/Cliente/criar', policies: ['aplicarPoliticaCadastro'] },
'POST  /clientes/salvar':                  { action: 'Cliente/cliente/atualizar'},

//Crud organização de vendas
'GET /organizacaovendas/listar':   { action: 'OrganizacaoVendas/OrganizacaoVendas/listar' },
'PUT /organizacaovendas/:id':      { action: 'OrganizacaoVendas/OrganizacaoVendas/atualizar' },
'POST /organizacaovendas':         { action: 'OrganizacaoVendas/OrganizacaoVendas/criar' },
'DELETE /organizacaovendas/:id':   { action: 'OrganizacaoVendas/OrganizacaoVendas/deletar' },

// Crud de produtos
'GET /produto/listar':         { action: 'Produto/Produto/listar' },
'PUT /produto/atualizar/:id':  { action: 'Produto/Produto/atualizar' },
'POST /produto/criar':          { action: 'Produto/Produto/criar' },
'DELETE /produto/deletar/:id': { action: 'Produto/Produto/deletar' },
//Crud Empresas
'GET /empresa/listar':         { action:'Empresa/Empresas/listar' },
'POST /empresa/':              { action:'Empresa/Empresas/criar' },
'PUT /empresa/:id':            { action:'Empresa/Empresas/atualizar' },
'DELETE /empresa/:id':         { action:'Empresa/Empresas/deletar' },

 // CRUD Grupo Empresas
 'GET /grupoempresa/listar':   { action: 'GrupoEmpresa/GrupoEmpresa/listar' },
 'POST /grupoempresa/':        { action: 'GrupoEmpresa/GrupoEmpresa/criar' },
 'PUT /grupoempresa/:id':      { action: 'GrupoEmpresa/GrupoEmpresa/atualizar' },
 'DELETE /grupoempresa/:id':   { action: 'GrupoEmpresa/GrupoEmpresa/deletar' },
 'GET /grupoempresa/todos':    { action: 'GrupoEmpresa/GrupoEmpresa/todos' },

// CRUD Politica de cadastro
'GET /politicacadastro/listar': { action: 'PoliticaCadastro/PoliticaCadastro/listar' },
'POST /politicacadastro':       { action: 'PoliticaCadastro/PoliticaCadastro/criar' },
'PUT /politicacadastro/:id':    { action: 'PoliticaCadastro/PoliticaCadastro/atualizar' },
'DELETE /politicacadastro/:id': { action: 'PoliticaCadastro/PoliticaCadastro/deletar' },
'GET /politicacadastro/todos':  { action: 'PoliticaCadastro/PoliticaCadastro/todos' },

// CRUD Grupo conta
'GET /grupoconta/listar': { action: 'GrupoConta/GrupoConta/listar' },
'POST /grupoconta':       { action: 'GrupoConta/GrupoConta/criar' },
'PUT /grupoconta/:id':    { action: 'GrupoConta/GrupoConta/atualizar' },
'DELETE /grupoconta/:id': { action: 'GrupoConta/GrupoConta/deletar' },
'GET /grupoconta/todos':  { action: 'GrupoConta/GrupoConta/todos' },

// CRUD Categoria
'GET /categoria/listar': { action: 'Categoria/Categoria/listar' },
'GET /categoria/:id':    { action: 'Categoria/Categoria/buscar' },
'POST /categoria':       { action: 'Categoria/Categoria/criar' },
'PUT /categoria/:id':    { action: 'Categoria/Categoria/atualizar' },
'DELETE /categoria/:id': { action: 'Categoria/Categoria/deletar' },

// CRUD Subcategoria
'GET /subcategoria/listar':           { action: 'SubCategoria/SubCategoria/listar' },
'GET /subcategoria/:id':              { action: 'SubCategoria/SubCategoria/buscar' },
'POST /subcategoria':                 { action: 'SubCategoria/SubCategoria/criar' },
'PUT /subcategoria/:id':              { action: 'SubCategoria/SubCategoria/atualizar' },
'DELETE /subcategoria/:id':           { action: 'SubCategoria/SubCategoria/deletar' },

// CRUD Marca
'GET /marca/listar':           { action: 'Marca/Marca/listar' },
'GET /marca/:id':              { action: 'Marca/Marca/buscar' },
'POST /marca':                 { action: 'Marca/Marca/criar' },
'PUT /marca/:id':              { action: 'Marca/Marca/atualizar' },
'DELETE /marca/:id':           { action: 'Marca/Marca/deletar' },

// CRUD Grupo de produto
'GET /grupoproduto/listar':        { action: 'GrupoProduto/GrupoProduto/listar' },
'GET /grupoproduto/:id':           { action: 'GrupoProduto/GrupoProduto/buscar' },
'POST /grupoproduto':              { action: 'GrupoProduto/GrupoProduto/criar' },
'PUT /grupoproduto/:id':           { action: 'GrupoProduto/GrupoProduto/atualizar' },
'DELETE /grupoproduto/:id':        { action: 'GrupoProduto/GrupoProduto/deletar' },



'GET /fluxoaprovacao/listar':           { action: 'FluxoAprovacao/FluxoAprovacao/listar' },
'GET /fluxoaprovacao/:id':              { action: 'FluxoAprovacao/FluxoAprovacao/buscar' },
'POST /fluxoaprovacao':                 { action: 'FluxoAprovacao/FluxoAprovacao/criar' },
'PUT /fluxoaprovacao/:id':              { action: 'FluxoAprovacao/FluxoAprovacao/atualizar' },
'DELETE /fluxoaprovacao/:id':           { action: 'FluxoAprovacao/FluxoAprovacao/deletar' },

'GET /regraaprovacao/listar/:fluxoId':  { action: 'FluxoAprovacao/RegraAprovacao/listar' },
'GET /regraaprovacao/:id':              { action: 'FluxoAprovacao/RegraAprovacao/buscar' },
'POST /regraaprovacao':                 { action: 'FluxoAprovacao/RegraAprovacao/criar' },
'PUT /regraaprovacao/:id':              { action: 'FluxoAprovacao/RegraAprovacao/atualizar' },
'DELETE /regraaprovacao/:id':           { action: 'FluxoAprovacao/RegraAprovacao/deletar' },

'GET /Aprovador/listar/:regraId': { action: 'FluxoAprovacao/Aprovador/listar' },
'GET /Aprovador/:id':             { action: 'FluxoAprovacao/Aprovador/buscar' },
'POST /Aprovador':                { action: 'FluxoAprovacao/Aprovador/criar' },
'PUT /Aprovador/:id':             { action: 'FluxoAprovacao/Aprovador/atualizar' },
'DELETE /Aprovador/:id':          { action: 'FluxoAprovacao/Aprovador/deletar' },

'GET /configuracoes':           {view:'pages/configuracoes' },

// CRUD para Perfis
'GET /perfis/listar':                   { action: 'Usuario/perfil/listar' },
'GET /perfis/:id':                      { action: 'Usuario/perfil/buscar' },
'POST /perfis/':                        { action: 'Usuario/perfil/criar' },
'PUT /perfis/:id':                      { action: 'Usuario/perfil/atualizar' },
'DELETE /perfis/:id':                   { action: 'Usuario/perfil/deletar' },
'POST /perfis/permissao/adicionar':     { action: 'Usuario/perfil/adicionarpermissao' },
'POST /perfis/permissao/remover':       { action: 'Usuario/perfil/removerpermissao' },

// CRUD para permissão
'GET /permissoes/listar':           { action: 'Usuario/Permissao/listar' },
'GET /permissoes/:id':              { action: 'Usuario/Permissao/buscar' },
'POST /permissoes':                 { action: 'Usuario/Permissao/criar' },
'PUT /permissoes/:id':              { action: 'Usuario/Permissao/atualizar' },
'DELETE /permissoes/:id':           { action: 'Usuario/Permissao/deletar' },

// CRUD para Canal
'GET /canal/listar':               { action: 'Canal/Canal/listar' },
'GET /canal/:id':                  { action: 'Canal/Canal/buscar' },
'POST /canal':                     { action: 'Canal/Canal/criar' },
'PUT /canal/:id':                  { action: 'Canal/Canal/atualizar' },
'DELETE /canal/:id':               { action: 'Canal/Canal/deletar' },

 // Rotas para Subcanal
 'GET /subcanal/listar':           { action: 'Subcanal/Subcanal/listar' },
 'GET /subcanal/:id':              { action: 'Subcanal/Subcanal/buscar' },
 'POST /subcanal':                 { action: 'Subcanal/Subcanal/criar' },
 'PUT /subcanal/:id':              { action: 'Subcanal/Subcanal/atualizar' },
 'DELETE /subcanal/:id':           { action: 'Subcanal/Subcanal/deletar' },

 // Rotas para Regiao
 'GET /regiao/listar':           { action: 'Regiao/Regiao/listar' },
 'GET /regiao/:id':              { action: 'Regiao/Regiao/buscar' },
 'POST /regiao':                 { action: 'Regiao/Regiao/criar' },
 'PUT /regiao/:id':              { action: 'Regiao/Regiao/atualizar' },
 'DELETE /regiao/:id':           { action: 'Regiao/Regiao/deletar' },
 'GET /regiao/buscarPorDescricao':   { action: 'Regiao/Regiao/buscarPorDescricao'},

  // Rotas para EscritorioVendas
  'GET /escritoriovendas/listar':             { action: 'EscritorioVendas/EscritorioVendas/listar' },
  'GET /escritoriovendas/:id':                { action: 'EscritorioVendas/EscritorioVendas/buscar' },
  'POST /escritoriovendas':                   { action: 'EscritorioVendas/EscritorioVendas/criar' },
  'PUT /escritoriovendas/:id':                { action: 'EscritorioVendas/EscritorioVendas/atualizar' },
  'DELETE /escritoriovendas/:id':             { action: 'EscritorioVendas/EscritorioVendas/deletar' },
  'GET /escritoriovendas/buscarEscritoriosPorDescricao': { action: 'EscritorioVendas/EscritorioVendas/buscarEscritoriosPorDescricao' },

  'GET /equipevendas/listar':           { action: 'EquipeVendas/EquipeVendas/listar' },
  'GET /equipevendas/:id':              { action: 'EquipeVendas/EquipeVendas/buscar' },
  'POST /equipevendas':                 { action: 'EquipeVendas/EquipeVendas/criar' },
  'PUT /equipevendas/:id':              { action: 'EquipeVendas/EquipeVendas/atualizar' },
  'DELETE /equipevendas/:id':           { action: 'EquipeVendas/EquipeVendas/deletar' },
  'GET /equipevendas/buscarEquipesPorDescricao': { action: 'EquipeVendas/EquipeVendas/buscarEquipesPorDescricao' },


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝

  '/terms':                   '/legal/terms',
  '/logout':                  '/api/v1/account/logout',


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // …


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.


  '/api/v1/account/logout':                           { action: 'account/logout' },
  'PUT   /api/v1/account/update-password':            { action: 'account/update-password' },
  'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  'PUT   /api/v1/account/update-billing-card':        { action: 'account/update-billing-card' },
  'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },
  'POST  /api/v1/observe-my-session':                    { action: 'observe-my-session', hasSocketFeatures: true },

};
