// api/controllers/EscritorioVendasController.js

module.exports = {
  listar: async function (req, res) {
    try {
      const escritorios = await EscritorioVendas.find();
      return res.view('pages/escritorioVendas/listar', { escritorios });
    } catch (err) {
      return res.serverError(err);
    }
  },

  buscar: async function (req, res) {
    try {
      const escritorio = await EscritorioVendas.findOne({ id: req.params.id });
      if (!escritorio) {
        return res.notFound('Escritório de Vendas não encontrado.');
      }
      return res.json(escritorio);
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { organizacaoVendas, codigo, descricao } = req.body;
      const novoEscritorio = await EscritorioVendas.create({
        organizacaoVendas,
        codigo,
        descricao
      }).fetch();
      return res.status(201).json({
        message: 'Escritório de Vendas criado com sucesso',
        escritorio: novoEscritorio
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { organizacaoVendas, codigo, descricao } = req.body;
      const escritorioId = req.params.id;

      const escritorioAtualizado = await EscritorioVendas.updateOne({ id: escritorioId }).set({
        organizacaoVendas,
        codigo,
        descricao
      });

      if (!escritorioAtualizado) {
        return res.notFound('Escritório de Vendas não encontrado.');
      }

      return res.json({
        message: 'Escritório de Vendas atualizado com sucesso',
        escritorio: escritorioAtualizado
      });
    } catch (err) {
      return res.serverError(err);
    }
  },
  buscarEscritoriosPorDescricao: async function (req, res) {
    try {
      const termo = req.query.termo || '';
      const escritoriosVendas = await EscritorioVendas.find({
        where: { descricao: { contains: termo } },
        limit: 10
      });
      return res.json(escritoriosVendas);
    } catch (err) {
      return res.serverError(err);
    }
  },
  deletar: async function (req, res) {
    try {
      const escritorioId = req.params.id;

      const escritorioDeletado = await EscritorioVendas.destroyOne({ id: escritorioId });

      if (!escritorioDeletado) {
        return res.notFound('Escritório de Vendas não encontrado.');
      }

      return res.json({
        message: 'Escritório de Vendas deletado com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
