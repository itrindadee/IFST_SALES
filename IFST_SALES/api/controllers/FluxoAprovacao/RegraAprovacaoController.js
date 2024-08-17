module.exports = {
  listar: async function (req, res) {
    try {
      const regras = await RegraAprovacao.find({ fluxo: req.params.fluxoId }).populate('aprovadores');
      return res.view('pages/FluxoAprovacao/regraaprovacao/listar', { regras });
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar as regras de aprovação.', error: err });
    }
  },

  buscar: async function (req, res) {
    try {
      const regra = await RegraAprovacao.findOne({ id: req.params.id }).populate('aprovadores');
      if (!regra) {
        return res.notFound({ message: 'Regra de Aprovação não encontrada.' });
      }
      return res.json(regra);
    } catch (err) {
      return res.serverError({ message: 'Erro ao buscar a regra de aprovação.', error: err });
    }
  },

  criar: async function (req, res) {
    try {
      const { nivel, tipo, fluxo } = req.body;
      const novaRegra = await RegraAprovacao.create({ nivel, tipo, fluxo }).fetch();
      return res.status(201).json({
        message: 'Regra de Aprovação criada com sucesso',
        regra: novaRegra,
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao criar a regra de aprovação.', error: err });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { nivel, tipo } = req.body;
      const regraId = req.params.id;

      const regraAtualizada = await RegraAprovacao.updateOne({ id: regraId }).set({ nivel, tipo });

      if (!regraAtualizada) {
        return res.notFound({ message: 'Regra de Aprovação não encontrada.' });
      }

      return res.json({
        message: 'Regra de Aprovação atualizada com sucesso',
        regra: regraAtualizada,
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao atualizar a regra de aprovação.', error: err });
    }
  },

  deletar: async function (req, res) {
    try {
      const regraId = req.params.id;

      const regraDeletada = await RegraAprovacao.destroyOne({ id: regraId });

      if (!regraDeletada) {
        return res.notFound({ message: 'Regra de Aprovação não encontrada.' });
      }

      return res.json({
        message: 'Regra de Aprovação deletada com sucesso',
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao deletar a regra de aprovação.', error: err });
    }
  }
};
