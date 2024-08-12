// api/controllers/IntegrationConfigController.js
module.exports = {
  criar: async function(req, res) {
    try {
      const config = await IntegrationConfig.create(req.body).fetch();
      return res.status(201).json(config);
    } catch (err) {
      return res.serverError(err);
    }
  },

  listar: async function(req, res) {
    try {
      const configs = await IntegrationConfig.find();
      return res.view('pages/integrationconfig/listar', { configs });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function(req, res) {
    try {
      const config = await IntegrationConfig.updateOne({ id: req.params.id }).set(req.body);
      return res.json(config);
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function(req, res) {
    try {
      await IntegrationConfig.destroyOne({ id: req.params.id });
      return res.ok();
    } catch (err) {
      return res.serverError(err);
    }
  }
};
