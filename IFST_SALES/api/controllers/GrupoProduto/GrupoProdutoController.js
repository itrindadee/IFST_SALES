// api/controllers/GrupoProdutoController.js

module.exports = {
  listar: async function (req, res) {
    try {
      const gruposProduto = await GrupoProduto.find();
      return res.view('pages/grupoproduto/listar', { gruposProduto });
    } catch (err) {
      return res.serverError(err);
    }
  },

  buscar: async function (req, res) {
    try {
      const grupoProduto = await GrupoProduto.findOne({ id: req.params.id });
      if (!grupoProduto) {
        return res.notFound('Grupo de Produto não encontrado.');
      }
      return res.json(grupoProduto);
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { codigo, descricao, ativo } = req.body;
      const novoGrupoProduto = await GrupoProduto.create({
        codigo,
        descricao,
        ativo
      }).fetch();
      return res.status(201).json({
        message: 'Grupo de Produto criado com sucesso',
        grupoProduto: novoGrupoProduto
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { codigo, descricao, ativo } = req.body;
      const grupoProdutoId = req.params.id;

      const grupoProdutoAtualizado = await GrupoProduto.updateOne({ id: grupoProdutoId }).set({
        codigo,
        descricao,
        ativo
      });

      if (!grupoProdutoAtualizado) {
        return res.notFound('Grupo de Produto não encontrado.');
      }

      return res.json({
        message: 'Grupo de Produto atualizado com sucesso',
        grupoProduto: grupoProdutoAtualizado
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const grupoProdutoId = req.params.id;

      const grupoProdutoDeletado = await GrupoProduto.destroyOne({ id: grupoProdutoId });

      if (!grupoProdutoDeletado) {
        return res.notFound('Grupo de Produto não encontrado.');
      }

      return res.json({
        message: 'Grupo de Produto deletado com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
