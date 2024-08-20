// api/controllers/PerfilController.js

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
      const perfis = await Perfil.find().populate('permissoes');
      const permissoes = await Permissao.find();
      return res.view('pages/perfil/listar', { perfis, permissoes });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar os perfis',
        error: err
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { nome, descricao, permissoes } = req.body;

      const perfilExistente = await Perfil.findOne({ nome });
      if (perfilExistente) {
        return res.status(400).json({ message: 'Nome de perfil já existe.' });
      }

      const novoPerfil = await Perfil.create({
        nome,
        descricao,
        createdBy: { id: userId, fullName }
      }).fetch();

      if (permissoes && permissoes.length > 0) {
        await Perfil.addToCollection(novoPerfil.id, 'permissoes').members(permissoes);
      }

      return res.status(201).json({
        message: 'Perfil criado com sucesso!',
        perfil: novoPerfil
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar o perfil',
        error: err
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const perfilId = req.params.id;

      const perfil = await Perfil.findOne({ id: perfilId }).populate('permissoes');
      if (!perfil) {
        return res.notFound({
          message: 'Perfil não encontrado'
        });
      }

      const todasPermissoes = await Permissao.find();

      return res.json({
        perfil: perfil,
        permissoesAssociadas: perfil.permissoes,
        todasPermissoes: todasPermissoes
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar o perfil',
        error: err
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { nome, descricao, permissoes } = req.body;
      const perfilId = req.params.id;

      const perfilExistente = await Perfil.findOne({ nome, id: { '!=': perfilId } });
      if (perfilExistente) {
        return res.status(400).json({ message: 'Nome de perfil já existe.' });
      }

      const perfilAtualizado = await Perfil.updateOne({ id: perfilId }).set({
        nome,
        descricao,
        updatedBy: { id: userId, fullName }
      });

      if (!perfilAtualizado) {
        return res.notFound({
          message: 'Perfil não encontrado'
        });
      }

      const permissoesArray = Array.isArray(permissoes) ? permissoes : [];
      if (permissoesArray.length > 0) {
        await Perfil.replaceCollection(perfilId, 'permissoes').members(permissoesArray);
      } else {
        await Perfil.replaceCollection(perfilId, 'permissoes').members([]);
      }

      return res.json({
        message: 'Perfil atualizado com sucesso!',
        perfil: perfilAtualizado
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar o perfil',
        error: err
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const perfilId = req.params.id;

      const perfil = await Perfil.findOne({ id: perfilId }).populate('permissoes');
      if (!perfil) {
        return res.notFound({
          message: 'Perfil não encontrado'
        });
      }

      const permissoesAssociadas = perfil.permissoes.map(permissao => permissao.id);

      await Perfil.removeFromCollection(perfilId, 'permissoes').members(permissoesAssociadas);

      const perfilDeletado = await Perfil.destroyOne({ id: perfilId });

      if (!perfilDeletado) {
        return res.notFound({
          message: 'Perfil não encontrado'
        });
      }

      return res.json({
        message: 'Perfil deletado com sucesso!'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar o perfil',
        error: err
      });
    }
  }
};
