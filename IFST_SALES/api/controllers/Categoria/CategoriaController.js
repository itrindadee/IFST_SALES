// api/controllers/CategoriaController.js

async function captureUserInfo(req) {
  const userId = req.session.userId;
  let fullName = req.session.fullName;

  if (!userId) {
    throw new Error('ID de usuário ausente na sessão');
  }

  if (!fullName) {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    fullName = user.fullName;
    req.session.fullName = fullName;
  }

  return { userId, fullName };
}

module.exports = {
  listar: async function (req, res) {
    try {
      const categorias = await Categoria.find();
      return res.view('pages/categoria/listar', { categorias });
    } catch (err) {
      return res.serverError({
        error: 'Erro ao listar categorias',
        details: err.message
      });
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
      return res.serverError({
        error: 'Erro ao buscar a categoria',
        details: err.message
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { codigo, descricao, ativo } = req.body;

      const novaCategoria = await Categoria.create({
        codigo,
        descricao,
        ativo,
        createdBy: { id: userId, fullName } // Passa o JSON para o modelo
      }).fetch();

      return res.status(201).json({
        message: 'Categoria criada com sucesso',
        categoria: novaCategoria
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao criar Categoria', error: err });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { codigo, descricao, ativo } = req.body;
      const categoriaId = req.params.id;

      const categoriaAtualizada = await Categoria.updateOne({ id: categoriaId }).set({
        codigo,
        descricao,
        ativo,
        updatedBy: { id: userId, fullName } // Passa o JSON para o modelo
      });

      if (!categoriaAtualizada) {
        return res.notFound('Categoria não encontrada.');
      }

      return res.json({
        message: 'Categoria atualizada com sucesso',
        categoria: categoriaAtualizada
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao autilizar Categoria', error: err });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const categoriaId = req.params.id;

      const categoriaDeletada = await Categoria.destroyOne({ id: categoriaId });

      if (!categoriaDeletada) {
        return res.notFound('Categoria não encontrada.');
      }

      return res.json({
        message: 'Categoria deletada com sucesso'
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao deletar Categoria', error: err });
    }
  }
};
