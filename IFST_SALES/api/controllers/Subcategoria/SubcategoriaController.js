module.exports = {
  listar: async function (req, res) {
    try {
      const subcategorias = await Subcategoria.find();
      return res.view('pages/subcategoria/listar', { subcategorias });
    } catch (err) {
      return res.serverError(err);
    }
  },

  buscar: async function (req, res) {
    try {
      const subcategoria = await Subcategoria.findOne({ id: req.params.id });
      if (!subcategoria) {
        return res.notFound('Subcategoria não encontrada.');
      }
      return res.json(subcategoria);
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { categoria, codigo, descricao, ativo } = req.body;
      const novaSubcategoria = await Subcategoria.create({
        categoria,
        codigo,
        descricao,
        ativo
      }).fetch();
      return res.status(201).json({
        message: 'Subcategoria criada com sucesso',
        subcategoria: novaSubcategoria
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { categoria, codigo, descricao, ativo } = req.body;
      const subcategoriaId = req.params.id;

      const subcategoriaAtualizada = await Subcategoria.updateOne({ id: subcategoriaId }).set({
        categoria,
        codigo,
        descricao,
        ativo
      });

      if (!subcategoriaAtualizada) {
        return res.notFound('Subcategoria não encontrada.');
      }

      return res.json({
        message: 'Subcategoria atualizada com sucesso',
        subcategoria: subcategoriaAtualizada
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const subcategoriaId = req.params.id;

      const subcategoriaDeletada = await Subcategoria.destroyOne({ id: subcategoriaId });

      if (!subcategoriaDeletada) {
        return res.notFound('Subcategoria não encontrada.');
      }

      return res.json({
        message: 'Subcategoria deletada com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
