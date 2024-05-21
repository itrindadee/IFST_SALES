// api/controllers/ClientesController.js
const EmpresasController = require('../controllers/EmpresasController');
const organizacaoVendas = require('../controllers/OrganizacaoVendasController');

module.exports = {
  criar: async function (req, res) {
    try {
      const {
        codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, cnpj, cpf, inscMunicipal,
        inscEstadual, transportadora, diasParaExpedicao, distrito, comissao, despesasBancarias,
        prazoPagamento, meioTransporte, moeda, pais, representante, desconto, rua, rua2, rua3,
        bairro, cep, cidade, numero, complemento, observacaoEndereco, uf
      } = req.body;

      if (!codigo || !empresa || !organizacaoVendas || !razaoSocial || !tipoCliente) {
        return res.badRequest('Por favor, forneça todos os campos obrigatórios.');
      }

      const novoCliente = await Cliente.create({
        codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, cnpj, cpf, inscMunicipal,
        inscEstadual, transportadora, diasParaExpedicao, distrito, comissao, despesasBancarias,
        prazoPagamento, meioTransporte, moeda, pais, representante, desconto, rua, rua2, rua3,
        bairro, cep, cidade, numero, complemento, observacaoEndereco, uf
      }).fetch();

      return res.status(201).json({ message: 'Cliente cadastrado com sucesso', cliente: novoCliente });
    } catch (err) {
      return res.serverError(err);
    }
  },

  listar: async function (req, res) {
    try {
      let { codigo, empresa, organizacaoVendas, page } = req.query;
      const clientesPorPagina = 8;

      page = parseInt(page);

      if (isNaN(page) || page < 1) {
        page = 1;
      }

      const filtro = {};

      if (codigo) filtro.codigo = { contains: codigo };
      if (empresa) filtro.empresa = { contains: empresa };
      if (organizacaoVendas) filtro.organizacaoVendas = { contains: organizacaoVendas };

      const totalClientes = await Cliente.count(filtro);
      const totalPages = Math.ceil(totalClientes / clientesPorPagina);
      const startIndex = (page - 1) * clientesPorPagina;

      const clientes = await Cliente.find({
        where: filtro,
        limit: clientesPorPagina,
        skip: startIndex
      });

      return res.view('pages/clientes/listar', {
        clientes, codigo, empresa, organizacaoVendas, totalPages, currentPage: page
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  editar: async function(req, res) {
    try {
      // Obter o ID do cliente a ser editado
      var clienteId = req.params.id;

      // Buscar o cliente no banco de dados
      var cliente = await Cliente.findOne({ id: clienteId });

      // Renderizar a view e passar o cliente como contexto
      return res.view('pages/clientes/editar', { cliente: cliente });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const {
        clienteId, codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, cnpj, cpf,
        inscMunicipal, inscEstadual, transportadora, diasParaExpedicao, distrito, comissao,
        despesasBancarias, prazoPagamento, meioTransporte, moeda, pais, representante, desconto,
        rua, rua2, rua3, bairro, cep, cidade, numero, complemento, observacaoEndereco, uf
      } = req.body;

      if (clienteId) {
        await Cliente.updateOne({ id: clienteId }).set({
          codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, cnpj, cpf, inscMunicipal,
          inscEstadual, transportadora, diasParaExpedicao, distrito, comissao, despesasBancarias,
          prazoPagamento, meioTransporte, moeda, pais, representante, desconto, rua, rua2, rua3,
          bairro, cep, cidade, numero, complemento, observacaoEndereco, uf
        });
        return res.json({ message: 'Cliente atualizado com sucesso' });
      } else {
        const novoCliente = await Cliente.create({
          codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, cnpj, cpf, inscMunicipal,
          inscEstadual, transportadora, diasParaExpedicao, distrito, comissao, despesasBancarias,
          prazoPagamento, meioTransporte, moeda, pais, representante, desconto, rua, rua2, rua3,
          bairro, cep, cidade, numero, complemento, observacaoEndereco, uf
        }).fetch();

        return res.status(201).json({ message: 'Cliente cadastrado com sucesso', cliente: novoCliente });
      }
    } catch (err) {
      return res.serverError(err);
    }
  },

  renderizarCadastro: async function(req, res) {
    try {
      const empresas = await EmpresasController.listarTodasEmpresas();
      const organizacoesVendas = await OrganizacaoVendas.find();
      return res.view('pages/clientes/criar', { empresas, organizacoesVendas, _csrf: req.csrfToken() });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
