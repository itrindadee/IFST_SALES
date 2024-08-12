// api/controllers/CategoriaController.js

module.exports = {
  listar: async function (req, res) {
    try {
      const categorias = await Categoria.find();
      return res.view('pages/categoria/listar', { categorias });
    } catch (err) {
      return res.serverError(err);
    }
  },

  buscar: async function (req, res) {
    try {
      const categoria = await Categoria.findOne({ id: req.params.id });
      if (!categoria) {
        return res.notFound('Categoria não encontrada.');
      }
      return res.json(categoria);
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { codigo, descricao, ativo } = req.body;
      const novaCategoria = await Categoria.create({
        codigo,
        descricao,
        ativo
      }).fetch();
      return res.status(201).json({
        message: 'Categoria criada com sucesso',
        categoria: novaCategoria
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { codigo, descricao, ativo } = req.body;
      const categoriaId = req.params.id;

      const categoriaAtualizada = await Categoria.updateOne({ id: categoriaId }).set({
        codigo,
        descricao,
        ativo
      });

      if (!categoriaAtualizada) {
        return res.notFound('Categoria não encontrada.');
      }

      return res.json({
        message: 'Categoria atualizada com sucesso',
        categoria: categoriaAtualizada
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const categoriaId = req.params.id;

      const categoriaDeletada = await Categoria.destroyOne({ id: categoriaId });

      if (!categoriaDeletada) {
        return res.notFound('Categoria não encontrada.');
      }

      return res.json({
        message: 'Categoria deletada com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
