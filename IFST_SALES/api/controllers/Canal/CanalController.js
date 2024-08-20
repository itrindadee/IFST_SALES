// api/controllers/CanalController.js

module.exports = {
  listar: async function (req, res) {
    try {
      const canais = await Canal.find();
      return res.view('pages/canal/listar', { canais });
    } catch (err) {
      return res.serverError({
        error: 'Erro ao listar canais',
        details: err.message
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const canal = await Canal.findOne({ id: req.params.id });
      if (!canal) {
        return res.notFound('Canal não encontrado.');
      }
      return res.json(canal);
    } catch (err) {
      return res.serverError({
        error: 'Erro ao buscar o canal',
        details: err.message
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { grupoConta, codigo, descricao, ativo } = req.body;
      const userId = req.session.userId;
      let fullName = req.session.fullName;

      if (!userId) {
        return res.serverError({
          error: 'ID de usuário ausente na sessão'
        });
      }

      if (!fullName) {
        const user = await User.findOne({ id: userId });
        if (!user) {
          return res.serverError({
            error: 'Usuário não encontrado'
          });
        }
        fullName = user.fullName;
        req.session.fullName = fullName;
      }

      const novoCanal = await Canal.create({
        grupoConta,
        codigo,
        descricao,
        ativo,
        createdBy: { id: userId, fullName } // Passa o JSON para o modelo
      }).fetch();

      return res.status(201).json({
        message: 'Canal criado com sucesso',
        canal: novoCanal
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao criar canal', error: err });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { grupoConta, codigo, descricao, ativo } = req.body;
      const canalId = req.params.id;
      const userId = req.session.userId;
      let fullName = req.session.fullName;

      if (!userId) {
        return res.serverError({
          error: 'ID de usuário ausente na sessão'
        });
      }

      if (!fullName) {
        const user = await User.findOne({ id: userId });
        if (!user) {
          return res.serverError({
            error: 'Usuário não encontrado'
          });
        }
        fullName = user.fullName;
        req.session.fullName = fullName;
      }

      const canalAtualizado = await Canal.updateOne({ id: canalId }).set({
        grupoConta,
        codigo,
        descricao,
        ativo,
        updatedBy: { id: userId, fullName } // Passa o JSON para o modelo
      });

      if (!canalAtualizado) {
        return res.notFound('Canal não encontrado.');
      }

      return res.json({
        message: 'Canal atualizado com sucesso',
        canal: canalAtualizado
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao atualizar Canal', error: err });
    }
  },

  deletar: async function (req, res) {
    try {
      const canalId = req.params.id;
      const userId = req.session.userId;
      let fullName = req.session.fullName;

      if (!userId) {
        return res.serverError({
          error: 'ID de usuário ausente na sessão'
        });
      }

      if (!fullName) {
        const user = await User.findOne({ id: userId });
        if (!user) {
          return res.serverError({
            error: 'Usuário não encontrado'
          });
        }
        fullName = user.fullName;
        req.session.fullName = fullName;
      }

      const canalDeletado = await Canal.destroyOne({ id: canalId });

      if (!canalDeletado) {
        return res.notFound('Canal não encontrado.');
      }

      return res.json({
        message: 'Canal deletado com sucesso'
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao deletar Canal', error: err });
    }
  },

  todos: async function (req, res) {
    try {
      const canais = await Canal.find();
      return res.json(canais);
    } catch (err) {
      return res.serverError({
        error: 'Erro ao buscar todos os canais',
        details: err.message
      });
    }
  }
};
