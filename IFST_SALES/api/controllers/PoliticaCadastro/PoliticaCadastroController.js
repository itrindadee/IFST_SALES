/**
 * PoliticaCadastroController.js
 *
 * @description :: Server-side actions for handling incoming requests.
 * @docs        :: https://sailsjs.com/docs/concepts/actions
 */

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
      const politicas = await PoliticaCadastro.find().populate('condicoes');
      return res.view('pages/politicaCadastro/listar', { politicas });
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar as políticas de cadastro', error: err.message });
    }
  },

  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { nome, ativo, condicoes, campoResultado, valorResultado } = req.body;

      const novaPolitica = await PoliticaCadastro.create({
        nome,
        ativo,
        campoResultado,
        valorResultado,
        createdBy: { id: userId, fullName }
      }).fetch();

      const condicoesPromises = condicoes.map(condicao => {
        return CondicaoCadastro.create({
          campo: condicao.campo,
          operador: condicao.operador,
          valor: condicao.valor,
          politicaCadastro: novaPolitica.id,
          createdBy: { id: userId, fullName }
        });
      });

      await Promise.all(condicoesPromises);

      return res.status(201).json({
        message: 'Política de cadastro criada com sucesso',
        politica: novaPolitica
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao criar a política de cadastro', error: err.message });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { nome, ativo, condicoes, campoResultado, valorResultado } = req.body;
      const politicaId = req.params.id;

      const politicaAtualizada = await PoliticaCadastro.updateOne({ id: politicaId }).set({
        nome,
        ativo,
        campoResultado,
        valorResultado,
        updatedBy: { id: userId, fullName }
      });

      if (!politicaAtualizada) {
        return res.notFound({ message: 'Política de cadastro não encontrada.' });
      }

      // Remove as condições existentes
      await CondicaoCadastro.destroy({ politicaCadastro: politicaId });

      // Adiciona as novas condições
      const condicoesPromises = condicoes.map(condicao => {
        return CondicaoCadastro.create({
          campo: condicao.campo,
          operador: condicao.operador,
          valor: condicao.valor,
          politicaCadastro: politicaId,
          createdBy: { id: userId, fullName }
        });
      });

      await Promise.all(condicoesPromises);

      return res.json({ message: 'Política de cadastro atualizada com sucesso', politica: politicaAtualizada });
    } catch (err) {
      return res.serverError({ message: 'Erro ao atualizar a política de cadastro', error: err.message });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const politicaId = req.params.id;

      // Remove as condições associadas primeiro
      await CondicaoCadastro.destroy({ politicaCadastro: politicaId });

      // Agora remove a política
      const politicaDeletada = await PoliticaCadastro.destroyOne({ id: politicaId });

      if (!politicaDeletada) {
        return res.notFound({ message: 'Política de cadastro não encontrada.' });
      }
      return res.json({ message: 'Política de cadastro deletada com sucesso' });
    } catch (err) {
      return res.serverError({ message: 'Erro ao deletar a política de cadastro', error: err.message });
    }
  },

  todos: async function (req, res) {
    try {
      const politicas = await PoliticaCadastro.find().populate('condicoes');
      return res.json(politicas);
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar as políticas de cadastro', error: err.message });
    }
  }
};
