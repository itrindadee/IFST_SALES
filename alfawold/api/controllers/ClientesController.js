// api/controllers/ClientesController.js

module.exports = {
  criar: async function (req, res) {
    try {
      const {
        codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, grupoContas, termoPesquisa,
        rua, cep, pais, regiao, domicilioFiscal, telefone, telefone2, email, cnpj, cpf, grupoEmpresa,
        inscEstadual, inscMunicipal, transportadora, diasParaExpedicao, distrito, comissao,
        despesasBancarias, prazoPagamento, meioTransporte, moeda, representante, desconto,
        rua2, rua3, bairro, cidade, numero, complemento, observacaoEndereco, uf
      } = req.body;

      if (!codigo || !empresa || !organizacaoVendas || !razaoSocial || !tipoCliente) {
        return res.badRequest('Por favor, forneça todos os campos obrigatórios.');
      }

      const novoCliente = await Cliente.create({
        codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, grupoContas, termoPesquisa,
        rua, cep, pais, regiao, domicilioFiscal, telefone, telefone2, email, cnpj, cpf, grupoEmpresa,
        inscEstadual, inscMunicipal, transportadora, diasParaExpedicao, distrito, comissao,
        despesasBancarias, prazoPagamento, meioTransporte, moeda, representante, desconto,
        rua2, rua3, bairro, cidade, numero, complemento, observacaoEndereco, uf
      }).fetch();

      return res.status(201).json({ message: 'Cliente cadastrado com sucesso', cliente: novoCliente });
    } catch (err) {
      return res.serverError(err);
    }
  },

  listar: async function (req, res) {
    try {
      let { codigo, empresa, organizacaoVendas, cpf, cnpj, page } = req.query;
      const clientesPorPagina = 8;

      page = parseInt(page);

      if (isNaN(page) || page < 1) {
        page = 1;
      }

      const filtro = {};

      if (codigo) filtro.codigo = { contains: codigo };
      if (empresa) filtro.empresa = { contains: empresa };
      if (organizacaoVendas) filtro.organizacaoVendas = { contains: organizacaoVendas };
      if (cpf) filtro.cpf = { contains: cpf };
      if (cnpj) filtro.cnpj = { contains: cnpj };

      const totalClientes = await Cliente.count(filtro);
      const totalPages = Math.ceil(totalClientes / clientesPorPagina);
      const startIndex = (page - 1) * clientesPorPagina;

      const clientes = await Cliente.find({
        where: filtro,
        limit: clientesPorPagina,
        skip: startIndex
      });

      return res.view('pages/clientes/listar', {
        clientes, codigo, empresa, organizacaoVendas, cpf, cnpj, totalPages, currentPage: page
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
        clienteId, codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, grupoContas, termoPesquisa,
        rua, cep, pais, regiao, domicilioFiscal, telefone, telefone2, email, cnpj, cpf, grupoEmpresa,
        inscEstadual, inscMunicipal, transportadora, diasParaExpedicao, distrito, comissao,
        despesasBancarias, prazoPagamento, meioTransporte, moeda, representante, desconto,
        rua2, rua3, bairro, cidade, numero, complemento, observacaoEndereco, uf
      } = req.body;

      if (clienteId) {
        await Cliente.updateOne({ id: clienteId }).set({
          codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, grupoContas, termoPesquisa,
          rua, cep, pais, regiao, domicilioFiscal, telefone, telefone2, email, cnpj, cpf, grupoEmpresa,
          inscEstadual, inscMunicipal, transportadora, diasParaExpedicao, distrito, comissao,
          despesasBancarias, prazoPagamento, meioTransporte, moeda, representante, desconto,
          rua2, rua3, bairro, cidade, numero, complemento, observacaoEndereco, uf
        });
        return res.json({ message: 'Cliente atualizado com sucesso' });
      } else {
        const novoCliente = await Cliente.create({
          codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, grupoContas, termoPesquisa,
          rua, cep, pais, regiao, domicilioFiscal, telefone, telefone2, email, cnpj, cpf, grupoEmpresa,
          inscEstadual, inscMunicipal, transportadora, diasParaExpedicao, distrito, comissao,
          despesasBancarias, prazoPagamento, meioTransporte, moeda, representante, desconto,
          rua2, rua3, bairro, cidade, numero, complemento, observacaoEndereco, uf
        }).fetch();

        return res.status(201).json({ message: 'Cliente cadastrado com sucesso', cliente: novoCliente });
      }
    } catch (err) {
      return res.serverError(err);
    }
  },

  validarcliente: async function (req, res) {
    try {
      const { cpf, cnpj, nomeEmpresa, organizacaoVendas, codigo } = req.query;

      if (!cpf && !cnpj) {
        return res.badRequest({ error: 'Preencha pelo menos um dos campos: CPF ou CNPJ.' });
      }

      const filtro = {};
      if (cpf) filtro.cpf = cpf;
      if (cnpj) filtro.cnpj = cnpj;
      if (organizacaoVendas) filtro.organizacaoVendas = organizacaoVendas;
      if (codigo) filtro.codigo = codigo;

      // Encontrar a empresa pelo nome
      if (nomeEmpresa) {
        const empresa = await Empresa.findOne({ nome: nomeEmpresa });
        if (empresa) {
          filtro.empresa = empresa.id;
        } else {
          return res.json(null);  // Empresa não encontrada, cliente inexistente
        }
      }

      const clienteExistente = await Cliente.findOne(filtro)
        .populate('empresa')
        .populate('organizacaoVendas');

      if (clienteExistente) {
        return res.json(clienteExistente);
      } else {
        return res.json(null);
      }
    } catch (err) {
      console.error('Error in validarCliente:', err);
      return res.serverError(err);
    }
  },

  renderizarCadastro: async function(req, res) {
    try {
      const empresas = await Empresa.find();
      const organizacoesVendas = await OrganizacaoVendas.find();
      return res.json({ empresas, organizacoesVendas });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
