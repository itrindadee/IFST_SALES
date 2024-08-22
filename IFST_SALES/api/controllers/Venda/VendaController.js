module.exports = {
  listar: async function (req, res) {
    try {
      const vendas = await Venda.find().populate('cliente').populate('produtos').populate('canal').populate('empresa').populate('organizacaoVendas');
      const clientes = await Cliente.find();
      const produtos = await Produto.find();
      const canais = await Canal.find(); // Buscando os canais
      const empresas = await Empresa.find(); // Buscando as empresas
      const organizacoesVendas = await OrganizacaoVendas.find(); // Buscando as organizações de vendas

      return res.view('pages/venda/listar', { vendas, clientes, produtos, canais, empresas, organizacoesVendas });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar as vendas.',
        error: err.message
      });
    }
  },
  criar: async function (req, res) {
    try {
      const { cliente, produtos, total, data } = req.body;

      const novaVenda = await Venda.create({
        cliente,
        produtos,
        total,
        data
      }).fetch();

      return res.status(201).json({
        message: 'Venda criada com sucesso',
        venda: novaVenda
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar a venda.',
        error: err.message
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const venda = await Venda.findOne({ id: req.params.id }).populate('cliente').populate('produtos');
      if (!venda) {
        return res.notFound({
          message: 'Venda não encontrada.'
        });
      }
      return res.json(venda);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar a venda.',
        error: err.message
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { cliente, produtos, total, data } = req.body;
      const vendaId = req.params.id;

      const vendaAtualizada = await Venda.updateOne({ id: vendaId }).set({
        cliente,
        produtos,
        total,
        data
      });

      if (!vendaAtualizada) {
        return res.notFound({
          message: 'Venda não encontrada.'
        });
      }

      return res.json({
        message: 'Venda atualizada com sucesso',
        venda: vendaAtualizada
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar a venda.',
        error: err.message
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const vendaId = req.params.id;

      const vendaDeletada = await Venda.destroyOne({ id: vendaId });

      if (!vendaDeletada) {
        return res.notFound({
          message: 'Venda não encontrada.'
        });
      }

      return res.json({
        message: 'Venda deletada com sucesso'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar a venda.',
        error: err.message
      });
    }
  }
};
