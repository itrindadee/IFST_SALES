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
      const regioes = await Regiao.find();
      return res.view('pages/regiao/listar', { regioes });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar as regiões.',
        error: err.message
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const regiao = await Regiao.findOne({ id: req.params.id });
      if (!regiao) {
        return res.notFound({
          message: 'Região não encontrada.'
        });
      }
      return res.json(regiao);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar a região.',
        error: err.message
      });
    }
  },

  buscarPorDescricao: async function (req, res) {
    try {
      const termo = req.query.termo || '';
      const regioesVendas = await Regiao.find({
        where: { descricao: { contains: termo } },
        limit: 10
      });
      return res.json(regioesVendas);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar regiões por descrição.',
        error: err.message
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { organizacaoVendas, codigo, descricao } = req.body;

      const novaRegiao = await Regiao.create({
        organizacaoVendas,
        codigo,
        descricao,
        createdBy: { id: userId, fullName }
      }).fetch();

      await sails.models.log.create({
        model: 'Regiao',
        action: 'create',
        newData: novaRegiao,
        user: `${userId} - ${fullName}`
      });

      return res.status(201).json({
        message: 'Região criada com sucesso',
        regiao: novaRegiao
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar a região.',
        error: err.message
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { organizacaoVendas, codigo, descricao } = req.body;
      const regiaoId = req.params.id;

      const regiaoAtualizada = await Regiao.updateOne({ id: regiaoId }).set({
        organizacaoVendas,
        codigo,
        descricao,
        updatedBy: { id: userId, fullName }
      });

      if (!regiaoAtualizada) {
        return res.notFound({
          message: 'Região não encontrada.'
        });
      }

      await sails.models.log.create({
        model: 'Regiao',
        action: 'update',
        oldData: regiaoAtualizada,
        newData: regiaoAtualizada,
        user: `${userId} - ${fullName}`
      });

      return res.json({
        message: 'Região atualizada com sucesso',
        regiao: regiaoAtualizada
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar a região.',
        error: err.message
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const regiaoId = req.params.id;

      const regiaoDeletada = await Regiao.destroyOne({ id: regiaoId });

      if (!regiaoDeletada) {
        return res.notFound({
          message: 'Região não encontrada.'
        });
      }

      await sails.models.log.create({
        model: 'Regiao',
        action: 'delete',
        oldData: regiaoDeletada,
        user: `${userId} - ${fullName}`
      });

      return res.json({
        message: 'Região deletada com sucesso'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar a região.',
        error: err.message
      });
    }
  }
};
