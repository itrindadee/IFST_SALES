// api/controllers/Cliente/ClientesController.js

module.exports = {
  criar: async function (req, res) {
    try {
      const { cliente, empresa, organizacaoVendas } = req.body;

      console.log("Recebido no controlador:", req.body);

      // Verifica se todos os componentes necessários foram fornecidos
      if (!cliente || !empresa || !organizacaoVendas) {
        return res.badRequest('Os dados do cliente, empresa e organização de vendas são obrigatórios.');
      }

      // Inicia uma transação para garantir que todas as operações sejam realizadas com sucesso ou revertidas em caso de falha
      await sails.getDatastore().transaction(async (db) => {
        // Constrói a condição de busca dinamicamente com base nos campos fornecidos
        const clienteCondicoes = [];
        if (cliente.cpf) {
          clienteCondicoes.push({ cpf: cliente.cpf });
        }
        if (cliente.cnpj) {
          clienteCondicoes.push({ cnpj: cliente.cnpj });
        }

        let clienteExistente = null;
        if (clienteCondicoes.length > 0) {
          clienteExistente = await Cliente.findOne({
            or: clienteCondicoes
          }).usingConnection(db);
        }

        if (!clienteExistente) {
          // Cria o cliente se não existir
          clienteExistente = await Cliente.create(cliente).usingConnection(db).fetch();
        }

        // Verifica se a empresa já existe
        let empresaExistente = await ClienteEmpresa.findOne({
          cliente: clienteExistente.id,
          // Aqui adicione a condição necessária para garantir que a empresa é única
        }).usingConnection(db);

        if (!empresaExistente) {
          // Adiciona o id do cliente ao objeto empresa e cria a empresa
          empresa.cliente = clienteExistente.id;
          empresaExistente = await ClienteEmpresa.create(empresa).usingConnection(db).fetch();
        }

        // Verifica se a organização de vendas já existe para este cliente e empresa
        let organizacaoVendasExistente = await ClienteOrganizacaoVendas.findOne({
          cliente: clienteExistente.id,
        }).usingConnection(db);

        if (!organizacaoVendasExistente) {
          // Adiciona o id do cliente e da empresa ao objeto organizacaoVendas e cria a organização de vendas
          organizacaoVendas.cliente = clienteExistente.id;
          organizacaoVendas.empresa = empresaExistente.id;
          organizacaoVendasExistente = await ClienteOrganizacaoVendas.create(organizacaoVendas).usingConnection(db).fetch();
        }

        // Responde com sucesso se todas as operações forem bem-sucedidas
        return res.status(201).json({
          success: true,
          message: 'Cliente, empresa e organização de vendas cadastrados com sucesso',
          cliente: clienteExistente,
          empresa: empresaExistente,
          organizacaoVendas: organizacaoVendasExistente,
        });
      });
    } catch (err) {
      // Loga o erro no console e retorna uma mensagem de erro
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Ocorreu um erro ao cadastrar o cliente, empresa e organização de vendas'
      });
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
      if (cpf) filtro.cpf = { contains: cpf };
      if (cnpj) filtro.cnpj = { contains: cnpj };

      const totalClientes = await Cliente.count(filtro);
      const totalPages = Math.ceil(totalClientes / clientesPorPagina);
      const startIndex = (page - 1) * clientesPorPagina;

      let clientes = await Cliente.find({
        where: filtro,
        limit: clientesPorPagina,
        skip: startIndex
      });

      // Arrays para armazenar os IDs de clientes associados às empresas e organizações de vendas filtradas
      let clienteIdsFromEmpresa = [];
      let clienteIdsFromOrganizacaoVendas = [];

      if (empresa) {
        // Buscar todas as empresas pelo código
        const empresas = await Empresa.find({ codigo: { contains: empresa } });
        const empresaIds = empresas.map(e => e.id);

        // Buscar todos os clienteEmpresas associados às IDs de empresas encontradas
        const clienteEmpresas = await ClienteEmpresa.find({ empresa: { in: empresaIds } });

        // Extrair os IDs dos clientes
        clienteIdsFromEmpresa = clienteEmpresas.map(ce => ce.cliente);
      }

      if (organizacaoVendas) {
        // Buscar todas as organizações de vendas pelo código
        const organizacoesVendas = await OrganizacaoVendas.find({ codigo: { contains: organizacaoVendas } });
        const organizacaoVendasIds = organizacoesVendas.map(ov => ov.id);

        // Buscar todos os clienteOrganizacoesVendas associados às IDs de organizações de vendas encontradas
        const clienteOrganizacoesVendas = await ClienteOrganizacaoVendas.find({ organizacaoVendas: { in: organizacaoVendasIds } });

        // Extrair os IDs dos clientes
        clienteIdsFromOrganizacaoVendas = clienteOrganizacoesVendas.map(cov => cov.cliente);
      }

      // Combinar os IDs de clientes com base nos filtros aplicados
      if (empresa && organizacaoVendas) {
        const finalClienteIds = clienteIdsFromEmpresa.filter(id => clienteIdsFromOrganizacaoVendas.includes(id));
        clientes = clientes.filter(cliente => finalClienteIds.includes(cliente.id));
      } else if (empresa) {
        clientes = clientes.filter(cliente => clienteIdsFromEmpresa.includes(cliente.id));
      } else if (organizacaoVendas) {
        clientes = clientes.filter(cliente => clienteIdsFromOrganizacaoVendas.includes(cliente.id));
      }

      const clientesCompletos = await Promise.all(clientes.map(async cliente => {
        const clienteEmpresas = await ClienteEmpresa.find({ cliente: cliente.id }).populate('empresa');
        const clienteOrganizacoesVendas = await ClienteOrganizacaoVendas.find({ cliente: cliente.id }).populate('organizacaoVendas');

        const empresasFiltradas = empresa
          ? clienteEmpresas.filter(ce => ce.empresa.codigo.includes(empresa))
          : clienteEmpresas;

        const organizacoesVendasFiltradas = organizacaoVendas
          ? clienteOrganizacoesVendas.filter(co => co.organizacaoVendas.codigo.includes(organizacaoVendas))
          : clienteOrganizacoesVendas;

        return {
          id: cliente.id,
          codigo: cliente.codigo,
          razaoSocial: cliente.razaoSocial,
          empresas: empresasFiltradas.map(ce => ({
            id: ce.empresa.id,
            codigo: ce.empresa.codigo
          })),
          organizacoesVendas: organizacoesVendasFiltradas.map(co => ({
            id: co.organizacaoVendas.id,
            codigo: co.organizacaoVendas.codigo
          }))
        };
      }));

      return res.view('pages/cliente/listar', {
        clientes: clientesCompletos,
        codigo,
        empresa,
        organizacaoVendas,
        cpf,
        cnpj,
        totalPages,
        currentPage: page
      });
    } catch (err) {
      return res.serverError(err);
    }
  },


  aatualizar: async function (req, res) {
    try {
      const {
        clienteId, codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, grupoContas, termoPesquisa,
        rua, cep, pais, regiao, domicilioFiscal, telefone, telefone2, email, cnpj, cpf, grupoEmpresa,
        inscEstadual, inscMunicipal, transportadora, diasParaExpedicao, distrito, comissao,
        despesasBancarias, prazoPagamento, meioTransporte, moeda, representante, desconto,
        rua2, rua3, bairro, cidade, numero, complemento, observacaoEndereco, uf, idioma, fornecedor, ctgCFOP
      } = req.body;

      if (!clienteId) {
        return res.badRequest('O ID do cliente é obrigatório para atualização.');
      }

      const clienteAtualizado = await Cliente.updateOne({ id: clienteId }).set({
        codigo, empresa, organizacaoVendas, razaoSocial, tipoCliente, grupoContas, termoPesquisa,
        rua, cep, pais, regiao, domicilioFiscal, telefone, telefone2, email, cnpj, cpf, grupoEmpresa,
        inscEstadual, inscMunicipal, transportadora, diasParaExpedicao, distrito, comissao,
        despesasBancarias, prazoPagamento, meioTransporte, moeda, representante, desconto,
        rua2, rua3, bairro, cidade, numero, complemento, observacaoEndereco, uf, idioma, fornecedor, ctgCFOP
      });

      if (!clienteAtualizado) {
        return res.notFound('Cliente não encontrado para atualização.');
      }

      return res.json({ message: 'Cliente atualizado com sucesso', cliente: clienteAtualizado });
    } catch (err) {
      return res.serverError(err);
    }
  },


  validarcliente: async function(req, res) {
    try {
        let { cpf, cnpj, empresa, organizacaoVendas } = req.params;

        console.log('Parâmetros recebidos:', { cpf, cnpj, empresa, organizacaoVendas });

        if (!cpf && !cnpj) {
            return res.badRequest('CPF ou CNPJ é obrigatório.');
        }

        // Limpar os valores de CPF e CNPJ
        cpf = cpf ? cpf.replace(/\D/g, '') : null;
        cnpj = cnpj ? cnpj.replace(/\D/g, '') : null;

        // Criar o critério de busca
        const criteria = cpf ? { cpf } : { cnpj };
        console.log('Critério de busca:', criteria);

        // Encontrar o cliente pelo CPF ou CNPJ
        const cliente = await Cliente.findOne(criteria);
        if (!cliente) {
            return res.json(null);  // Cliente não encontrado
        }

        // Buscar a associação do cliente com a empresa e organização de vendas em paralelo
        const [clienteEmpresa, clienteOrganizacaoVendas] = await Promise.all([
            ClienteEmpresa.findOne({
                cliente: cliente.id,
                empresa: empresa !== 'null' ? empresa : undefined
            }),
            ClienteOrganizacaoVendas.findOne({
                cliente: cliente.id,
                organizacaoVendas: organizacaoVendas !== 'null' ? organizacaoVendas : undefined
            })
        ]);

        console.log('Cliente:', cliente);
        console.log('ClienteEmpresa:', clienteEmpresa);
        console.log('ClienteOrganizacaoVendas:', clienteOrganizacaoVendas);

        if (clienteEmpresa && clienteOrganizacaoVendas) {
            // Cliente já está associado a esta empresa e organização de vendas
            return res.json({
                cliente,
                empresa: clienteEmpresa,
                organizacaoVendas: clienteOrganizacaoVendas
            });
        } else if (clienteEmpresa || clienteOrganizacaoVendas) {
            // Cliente está associado a pelo menos uma das entidades (empresa ou organização de vendas)
            return res.json({
                cliente,
                empresa: clienteEmpresa ? clienteEmpresa.empresa : null,
                organizacaoVendas: clienteOrganizacaoVendas ? clienteOrganizacaoVendas.organizacaoVendas : null
            });
        } else {
            // Cliente não está associado nem a empresa nem à organização de vendas
            return res.json({
                cliente,
                empresa: null,
                organizacaoVendas: null
            });
        }
    } catch (err) {
        console.error('Erro ao validar cliente:', err);
        return res.status(500).json({ success: false, message: 'Erro ao validar cliente' });
    }
},



  renderizarCadastro: async function (req, res) {
    try {
      const empresas = await Empresa.find();
      const organizacoesVendas = await OrganizacaoVendas.find();
      return res.json({ empresas, organizacoesVendas });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
