// api/controllers/FluxoAprovacao/FluxoAprovacaoController.js

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
      const fluxos = await FluxoAprovacao.find().populate('regras');
      const usuarios = await User.find();

      for (let fluxo of fluxos) {
        for (let regra of fluxo.regras) {
          const populatedRegra = await RegraAprovacao.findOne({ id: regra.id }).populate('aprovadores');
          regra.aprovadores = populatedRegra.aprovadores;
        }
      }

      return res.view('pages/fluxoaprovacao/listar', { fluxos, usuarios });
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar fluxo de aprovação', error: err });
    }
  },

  buscar: async function (req, res) {
    try {
      const fluxo = await FluxoAprovacao.findOne({ id: req.params.id }).populate('regras');

      if (!fluxo) {
        return res.notFound('Fluxo de Aprovação não encontrado.');
      }

      for (let regra of fluxo.regras) {
        regra.aprovadores = await Aprovador.find({ regra: regra.id }).populate('usuario');
        regra.aprovadorNome = regra.aprovadores[0]?.usuario?.fullName;
      }

      return res.json(fluxo);
    } catch (err) {
      return res.serverError({ message: 'Erro ao buscar fluxo de aprovação', error: err });
    }
  },

  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { nome, descricao, regras } = req.body;

      const novoFluxo = await FluxoAprovacao.create({
        nome,
        descricao,
        createdBy: { id: userId, fullName }
      }).fetch();

      if (regras && regras.length > 0) {
        for (let regra of regras) {
          const novaRegra = await RegraAprovacao.create({
            nivel: regra.nivel,
            tipo: regra.tipo,
            fluxo: novoFluxo.id,
            createdBy: { id: userId, fullName }
          }).fetch();

          if (regra.aprovador) {
            await Aprovador.create({
              ordem: 1,
              regra: novaRegra.id,
              usuario: regra.aprovador,
              createdBy: { id: userId, fullName }
            });
          }
        }
      }

      return res.status(201).json({ message: 'Fluxo de Aprovação criado com sucesso', fluxo: novoFluxo });
    } catch (err) {
      return res.serverError({ message: 'Erro ao criar fluxo de aprovação.', error: err });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { nome, descricao, regras } = req.body;
      const fluxoId = req.params.id;

      const fluxoAtualizado = await FluxoAprovacao.updateOne({ id: fluxoId }).set({
        nome,
        descricao,
        updatedBy: { id: userId, fullName }
      });

      await RegraAprovacao.destroy({ fluxo: fluxoId });

      for (const regra of regras) {
        const novaRegra = await RegraAprovacao.create({
          nivel: regra.nivel,
          tipo: regra.tipo,
          fluxo: fluxoId,
          createdBy: { id: userId, fullName }
        }).fetch();

        if (regra.aprovador) {
          await Aprovador.create({
            ordem: 1,
            regra: novaRegra.id,
            usuario: regra.aprovador,
            createdBy: { id: userId, fullName }
          });
        }
      }

      if (!fluxoAtualizado) {
        return res.notFound('Fluxo de Aprovação não encontrado.');
      }

      return res.json({ message: 'Fluxo de Aprovação atualizado com sucesso' });
    } catch (err) {
      return res.serverError({ message: 'Erro ao atualizar fluxo de aprovação.', error: err });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const fluxoId = req.params.id;

      const fluxoDeletado = await FluxoAprovacao.destroyOne({ id: fluxoId });

      if (!fluxoDeletado) {
        return res.notFound('Fluxo de Aprovação não encontrado.');
      }

      return res.json({ message: 'Fluxo de Aprovação deletado com sucesso' });
    } catch (err) {
      return res.serverError({ message: 'Erro ao deletar fluxo de aprovação.', error: err });
    }
  }
};
