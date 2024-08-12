// api/controllers/FluxoAprovacao/FluxoAprovacaoController.js

module.exports = {
  listar: async function (req, res) {
    try {
      // Buscar todos os fluxos de aprovação com suas regras e aprovadores
      const fluxos = await FluxoAprovacao.find().populate('regras');

      // Buscar todos os usuários (aprovadores) disponíveis
      const usuarios = await User.find();

      // Popula as regras com seus aprovadores
      for (let fluxo of fluxos) {
        for (let regra of fluxo.regras) {
          const populatedRegra = await RegraAprovacao.findOne({ id: regra.id }).populate('aprovadores');
          regra.aprovadores = populatedRegra.aprovadores;
        }
      }

      // Renderiza a view passando fluxos e usuarios
      return res.view('pages/fluxoaprovacao/listar', { fluxos, usuarios });
    } catch (err) {
      return res.serverError(err);
    }
  },

  buscar: async function (req, res) {
    try {
      const fluxo = await FluxoAprovacao.findOne({ id: req.params.id })
        .populate('regras');

      if (!fluxo) {
        return res.notFound('Fluxo de Aprovação não encontrado.');
      }

      // Fazer o populate dos aprovadores para cada regra
      for (let regra of fluxo.regras) {
        regra.aprovadores = await Aprovador.find({ regra: regra.id }).populate('usuario');
      }

      return res.json(fluxo);
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { nome, descricao, regras } = req.body;

      const novoFluxo = await FluxoAprovacao.create({ nome, descricao }).fetch();

      if (regras && regras.length > 0) {
        for (let regra of regras) {
          const novaRegra = await RegraAprovacao.create({
            nivel: regra.nivel,
            tipo: regra.tipo,
            fluxo: novoFluxo.id,
          }).fetch();

          if (regra.aprovador) {
            await Aprovador.create({
              ordem: 1, // Ajuste conforme necessário
              regra: novaRegra.id,
              usuario: regra.aprovador,
            });
          }
        }
      }

      return res.status(201).json({
        message: 'Fluxo de Aprovação criado com sucesso',
        fluxo: novoFluxo,
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { nome, descricao, regras } = req.body;
      const fluxoId = req.params.id;

      const fluxoAtualizado = await FluxoAprovacao.updateOne({ id: fluxoId }).set({
        nome,
        descricao,
      });

      await RegraAprovacao.destroy({ fluxo: fluxoId });
      for (const regra of regras) {
        const novaRegra = await RegraAprovacao.create({
          nivel: regra.nivel,
          tipo: regra.tipo,
          fluxo: fluxoId,
        }).fetch();

        await Aprovador.create({
          ordem: 1,
          regra: novaRegra.id,
          usuario: regra.aprovador,
        });
      }

      if (!fluxoAtualizado) {
        return res.notFound('Fluxo de Aprovação não encontrado.');
      }

      return res.json({ message: 'Fluxo de Aprovação atualizado com sucesso' });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const fluxoId = req.params.id;

      const fluxoDeletado = await FluxoAprovacao.destroyOne({ id: fluxoId });

      if (!fluxoDeletado) {
        return res.notFound('Fluxo de Aprovação não encontrado.');
      }

      return res.json({
        message: 'Fluxo de Aprovação deletado com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
