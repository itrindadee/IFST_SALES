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
      const subcategorias = await Subcategoria.find();
      return res.view('pages/subcategoria/listar', { subcategorias });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar subcategorias.',
        error: err.message
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const subcategoria = await Subcategoria.findOne({ id: req.params.id });
      if (!subcategoria) {
        return res.notFound({
          message: 'Subcategoria não encontrada.'
        });
      }
      return res.json(subcategoria);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar a subcategoria.',
        error: err.message
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { categoria, codigo, descricao, ativo } = req.body;

      const novaSubcategoria = await Subcategoria.create({
        categoria,
        codigo,
        descricao,
        ativo,
        createdBy: { id: userId, fullName }
      }).fetch();

      await sails.models.log.create({
        model: 'Subcategoria',
        action: 'create',
        newData: novaSubcategoria,
        user: `${userId} - ${fullName}`
      });

      return res.status(201).json({
        message: 'Subcategoria criada com sucesso',
        subcategoria: novaSubcategoria
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar a subcategoria.',
        error: err.message
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { categoria, codigo, descricao, ativo } = req.body;
      const subcategoriaId = req.params.id;

      const subcategoriaAtualizada = await Subcategoria.updateOne({ id: subcategoriaId }).set({
        categoria,
        codigo,
        descricao,
        ativo,
        updatedBy: { id: userId, fullName }
      });

      if (!subcategoriaAtualizada) {
        return res.notFound({
          message: 'Subcategoria não encontrada.'
        });
      }

      await sails.models.log.create({
        model: 'Subcategoria',
        action: 'update',
        oldData: subcategoriaAtualizada,
        newData: subcategoriaAtualizada,
        user: `${userId} - ${fullName}`
      });

      return res.json({
        message: 'Subcategoria atualizada com sucesso',
        subcategoria: subcategoriaAtualizada
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar a subcategoria.',
        error: err.message
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const subcategoriaId = req.params.id;

      const subcategoriaDeletada = await Subcategoria.destroyOne({ id: subcategoriaId });

      if (!subcategoriaDeletada) {
        return res.notFound({
          message: 'Subcategoria não encontrada.'
        });
      }

      await sails.models.log.create({
        model: 'Subcategoria',
        action: 'delete',
        oldData: subcategoriaDeletada,
        user: `${userId} - ${fullName}`
      });

      return res.json({
        message: 'Subcategoria deletada com sucesso'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar a subcategoria.',
        error: err.message
      });
    }
  }
};
