module.exports = {
  listar: async function (req, res) {
    try {
      const marcas = await Marca.find();
      return res.view('pages/marca/listar', { marcas });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar as marcas.',
        error: err
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const marca = await Marca.findOne({ id: req.params.id });
      if (!marca) {
        return res.notFound({
          message: 'Marca não encontrada.'
        });
      }
      return res.json(marca);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar a marca.',
        error: err
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { codigo, descricao, ativo } = req.body;
      const novaMarca = await Marca.create({
        codigo,
        descricao,
        ativo
      }).fetch();
      return res.status(201).json({
        message: 'Marca criada com sucesso',
        marca: novaMarca
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar a marca.',
        error: err
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { codigo, descricao, ativo } = req.body;
      const marcaId = req.params.id;

      const marcaAtualizada = await Marca.updateOne({ id: marcaId }).set({
        codigo,
        descricao,
        ativo
      });

      if (!marcaAtualizada) {
        return res.notFound({
          message: 'Marca não encontrada.'
        });
      }

      return res.json({
        message: 'Marca atualizada com sucesso',
        marca: marcaAtualizada
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar a marca.',
        error: err
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const marcaId = req.params.id;

      const marcaDeletada = await Marca.destroyOne({ id: marcaId });

      if (!marcaDeletada) {
        return res.notFound({
          message: 'Marca não encontrada.'
        });
      }

      return res.json({
        message: 'Marca deletada com sucesso'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar a marca.',
        error: err
      });
    }
  }
};
