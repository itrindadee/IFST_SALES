// api/controllers/SubcanalController.js

module.exports = {
  listar: async function (req, res) {
    try {
      const subcanais = await Subcanal.find();
      return res.view('pages/subcanal/listar', { subcanais });
    } catch (err) {
      return res.serverError(err);
    }
  },

  buscar: async function (req, res) {
    try {
      const subcanal = await Subcanal.findOne({ id: req.params.id });
      if (!subcanal) {
        return res.notFound('Subcanal não encontrado.');
      }
      return res.json(subcanal);
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { grupoConta, canal, codigo, descricao, ativo } = req.body;
      const novoSubcanal = await Subcanal.create({
        grupoConta,
        canal,
        codigo,
        descricao,
        ativo
      }).fetch();
      return res.status(201).json({
        message: 'Subcanal criado com sucesso',
        subcanal: novoSubcanal
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { grupoConta, canal, codigo, descricao, ativo } = req.body;
      const subcanalId = req.params.id;

      const subcanalAtualizado = await Subcanal.updateOne({ id: subcanalId }).set({
        grupoConta,
        canal,
        codigo,
        descricao,
        ativo
      });

      if (!subcanalAtualizado) {
        return res.notFound('Subcanal não encontrado.');
      }

      return res.json({
        message: 'Subcanal atualizado com sucesso',
        subcanal: subcanalAtualizado
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const subcanalId = req.params.id;

      const subcanalDeletado = await Subcanal.destroyOne({ id: subcanalId });

      if (!subcanalDeletado) {
        return res.notFound('Subcanal não encontrado.');
      }

      return res.json({
        message: 'Subcanal deletado com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
