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
      const subcanais = await Subcanal.find();
      return res.view('pages/subcanal/listar', { subcanais });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar os subcanais.',
        error: err.message
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const subcanal = await Subcanal.findOne({ id: req.params.id });
      if (!subcanal) {
        return res.notFound({
          message: 'Subcanal não encontrado.'
        });
      }
      return res.json(subcanal);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar o subcanal.',
        error: err.message
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { grupoConta, canal, codigo, descricao, ativo } = req.body;

      const novoSubcanal = await Subcanal.create({
        grupoConta,
        canal,
        codigo,
        descricao,
        ativo,
        createdBy: { id: userId, fullName }
      }).fetch();

      await sails.models.log.create({
        model: 'Subcanal',
        action: 'create',
        newData: novoSubcanal,
        user: `${userId} - ${fullName}`
      });

      return res.status(201).json({
        message: 'Subcanal criado com sucesso',
        subcanal: novoSubcanal
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar o subcanal.',
        error: err.message
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { grupoConta, canal, codigo, descricao, ativo } = req.body;
      const subcanalId = req.params.id;

      const subcanalAtualizado = await Subcanal.updateOne({ id: subcanalId }).set({
        grupoConta,
        canal,
        codigo,
        descricao,
        ativo,
        updatedBy: { id: userId, fullName }
      });

      if (!subcanalAtualizado) {
        return res.notFound({
          message: 'Subcanal não encontrado.'
        });
      }

      await sails.models.log.create({
        model: 'Subcanal',
        action: 'update',
        oldData: subcanalAtualizado,
        newData: subcanalAtualizado,
        user: `${userId} - ${fullName}`
      });

      return res.json({
        message: 'Subcanal atualizado com sucesso',
        subcanal: subcanalAtualizado
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar o subcanal.',
        error: err.message
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const subcanalId = req.params.id;

      const subcanalDeletado = await Subcanal.destroyOne({ id: subcanalId });

      if (!subcanalDeletado) {
        return res.notFound({
          message: 'Subcanal não encontrado.'
        });
      }

      await sails.models.log.create({
        model: 'Subcanal',
        action: 'delete',
        oldData: subcanalDeletado,
        user: `${userId} - ${fullName}`
      });

      return res.json({
        message: 'Subcanal deletado com sucesso'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar o subcanal.',
        error: err.message
      });
    }
  }
};
