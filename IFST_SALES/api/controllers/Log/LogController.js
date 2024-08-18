// api/controllers/LogController.js
module.exports = {
  listar: async function (req, res) {
    try {
      const logs = await Log.find().sort('createdAt DESC');
      return res.view('pages/log/listar', { logs });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar os logs.',
        error: err
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const log = await Log.findOne({ id: req.params.id });
      if (!log) {
        return res.notFound({
          message: 'Log não encontrado.'
        });
      }
      return res.json(log);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar o log.',
        error: err
      });
    }
  }
};
