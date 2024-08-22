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
      // Selecionar todas as empresas, organizações de vendas, e canais
      const empresas = await Empresa.find();
      const organizacoesVendas = await OrganizacaoVendas.find();
      const canais = await Canal.find();
      const gruposEmpresas = await GrupoEmpresa.find();

      // Selecionar todos os clientes
      let clientes = await Cliente.find();

      // Carregar as associações de ClienteEmpresa e ClienteOrganizacaoVendas para cada cliente
      const clientesCompletos = await Promise.all(clientes.map(async cliente => {
        const clienteEmpresas = await ClienteEmpresa.find({ cliente: cliente.id }).populate('empresa');
        const clienteOrganizacoesVendas = await ClienteOrganizacaoVendas.find({ cliente: cliente.id }).populate('organizacaoVendas');

        return {
          id: cliente.id,
          codigo: cliente.codigo,
          razaoSocial: cliente.razaoSocial,
          empresas: clienteEmpresas.map(ce => ({
            id: ce.empresa.id,
            codigo: ce.empresa.codigo
          })),
          organizacoesVendas: clienteOrganizacoesVendas.map(co => ({
            id: co.organizacaoVendas.id,
            codigo: co.organizacaoVendas.codigo
          }))
        };
      }));

      // Renderizar a view com todos os clientes e suas associações, além de empresas, organizações de vendas e canais
      return res.view('pages/cliente/listar', {
        clientes: clientesCompletos,
        empresas,
        organizacoesVendas,
        canais,
        gruposEmpresas
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
