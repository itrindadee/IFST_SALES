// api/controllers/FluxoAprovacao/AprovadorController.js

module.exports = {

  listar: async function (req, res) {
    try {
      const aprovadores = await Aprovador.find().populate('usuario').populate('regra');
      return res.json(aprovadores);
    } catch (err) {
      return res.serverError(err);
    }
  },

  buscar: async function (req, res) {
    try {
      const aprovadorId = req.params.id;
      const aprovador = await Aprovador.findOne({ id: aprovadorId }).populate('usuario').populate('regra');

      if (!aprovador) {
        return res.notFound('Aprovador não encontrado.');
      }

      return res.json(aprovador);
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { ordem, regra, usuario } = req.body;

      const novoAprovador = await Aprovador.create({
        ordem,
        regra,
        usuario
      }).fetch();

      return res.status(201).json({
        message: 'Aprovador criado com sucesso',
        aprovador: novoAprovador
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const aprovadorId = req.params.id;
      const { ordem, regra, usuario } = req.body;

      const aprovadorAtualizado = await Aprovador.updateOne({ id: aprovadorId }).set({
        ordem,
        regra,
        usuario
      });

      if (!aprovadorAtualizado) {
        return res.notFound('Aprovador não encontrado.');
      }

      return res.json({
        message: 'Aprovador atualizado com sucesso',
        aprovador: aprovadorAtualizado
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const aprovadorId = req.params.id;

      const aprovadorDeletado = await Aprovador.destroyOne({ id: aprovadorId });

      if (!aprovadorDeletado) {
        return res.notFound('Aprovador não encontrado.');
      }

      return res.json({
        message: 'Aprovador deletado com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
