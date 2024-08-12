// api/controllers/EquipeVendasController.js

module.exports = {
  listar: async function (req, res) {
    try {
      const equipes = await EquipeVendas.find();
      return res.view('pages/equipeVendas/listar', { equipes });
    } catch (err) {
      return res.serverError(err);
    }
  },

  buscar: async function (req, res) {
    try {
      const equipe = await EquipeVendas.findOne({ id: req.params.id });
      if (!equipe) {
        return res.notFound('Equipe de Vendas não encontrada.');
      }
      return res.json(equipe);
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { organizacaoVendas, codigo, descricao } = req.body;
      const novaEquipe = await EquipeVendas.create({
        organizacaoVendas,
        codigo,
        descricao
      }).fetch();
      return res.status(201).json({
        message: 'Equipe de Vendas criada com sucesso',
        equipe: novaEquipe
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { organizacaoVendas, codigo, descricao } = req.body;
      const equipeId = req.params.id;

      const equipeAtualizada = await EquipeVendas.updateOne({ id: equipeId }).set({
        organizacaoVendas,
        codigo,
        descricao
      });

      if (!equipeAtualizada) {
        return res.notFound('Equipe de Vendas não encontrada.');
      }

      return res.json({
        message: 'Equipe de Vendas atualizada com sucesso',
        equipe: equipeAtualizada
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const equipeId = req.params.id;

      const equipeDeletada = await EquipeVendas.destroyOne({ id: equipeId });

      if (!equipeDeletada) {
        return res.notFound('Equipe de Vendas não encontrada.');
      }

      return res.json({
        message: 'Equipe de Vendas deletada com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  },
  buscarEquipesPorDescricao: async function (req, res) {
    try {
      const termo = req.query.termo || '';
      const equipesVendas = await EquipeVendas.find({
        where: { descricao: { contains: termo } },
        limit: 10
      });
      return res.json(equipesVendas);
    } catch (err) {
      return res.serverError(err);
    }
  }
};
