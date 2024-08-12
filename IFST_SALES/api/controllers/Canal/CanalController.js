// api/controllers/CanalController.js
module.exports = {
  listar: async function (req, res) {
    try {
      const canais = await Canal.find();
      return res.view('pages/canal/listar', { canais });
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { grupoConta, codigo, descricao, ativo } = req.body;

      const novoCanal = await Canal.create({
        grupoConta,
        codigo,
        descricao,
        ativo
      }).fetch();

      return res.status(201).json({
        message: 'Canal criado com sucesso',
        canal: novoCanal
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { grupoConta, codigo, descricao, ativo } = req.body;
      const canalId = req.params.id;

      const canalAtualizado = await Canal.updateOne({ id: canalId }).set({
        grupoConta,
        codigo,
        descricao,
        ativo
      });

      if (!canalAtualizado) {
        return res.notFound('Canal não encontrado.');
      }

      return res.json({
        message: 'Canal atualizado com sucesso',
        canal: canalAtualizado
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const canalId = req.params.id;

      const canalDeletado = await Canal.destroyOne({ id: canalId });

      if (!canalDeletado) {
        return res.notFound('Canal não encontrado.');
      }

      return res.json({
        message: 'Canal deletado com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  todos: async function (req, res) {
    try {
      const canais = await Canal.find();
      return res.json(canais);
    } catch (err) {
      return res.serverError(err);
    }
  }
};
