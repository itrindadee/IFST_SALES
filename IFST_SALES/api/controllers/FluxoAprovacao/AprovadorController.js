// api/controllers/FluxoAprovacao/AprovadorController.js

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
      const aprovadores = await Aprovador.find();
      return res.view('pages/aprovador/listar', { aprovadores });
    } catch (err) {
      return res.serverError({
        error: 'Erro ao listar aprovadores',
        details: err.message
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const aprovador = await Aprovador.findOne({ id: req.params.id });
      if (!aprovador) {
        return res.notFound('Aprovador não encontrado.');
      }
      return res.json(aprovador);
    } catch (err) {
      return res.serverError({
        error: 'Erro ao buscar o aprovador',
        details: err.message
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { ordem, regra, usuario } = req.body;

      const novoAprovador = await Aprovador.create({
        ordem,
        regra,
        usuario,
        createdBy: { id: userId, fullName } // Passa o JSON para o modelo
      }).fetch();

      return res.status(201).json({
        message: 'Aprovador criado com sucesso',
        aprovador: novoAprovador
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao criar aprovador', error: err });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { ordem, regra, usuario } = req.body;
      const aprovadorId = req.params.id;

      const aprovadorAtualizado = await Aprovador.updateOne({ id: aprovadorId }).set({
        ordem,
        regra,
        usuario,
        updatedBy: { id: userId, fullName } // Passa o JSON para o modelo
      });

      if (!aprovadorAtualizado) {
        return res.notFound('Aprovador não encontrado.');
      }

      return res.json({
        message: 'Aprovador atualizado com sucesso',
        aprovador: aprovadorAtualizado
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao atualizar aprovador', error: err });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const aprovadorId = req.params.id;

      const aprovadorDeletado = await Aprovador.destroyOne({ id: aprovadorId });

      if (!aprovadorDeletado) {
        return res.notFound('Aprovador não encontrado.');
      }

      return res.json({
        message: 'Aprovador deletado com sucesso'
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao deletar aprovador', error: err });
    }
  },

  todos: async function (req, res) {
    try {
      const aprovadores = await Aprovador.find();
      return res.json(aprovadores);
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar todos os aprovadores', error: err });
    }
  }
};
