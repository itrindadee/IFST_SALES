/**
 * PoliticaCadastroController.js
 *
 * @description :: Server-side actions for handling incoming requests.
 * @docs        :: https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  listar: async function (req, res) {
    try {
      const politicas = await PoliticaCadastro.find().populate('condicoes');
      return res.view('pages/politicaCadastro/listar', { politicas });
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { nome, ativo, condicoes, campoResultado, valorResultado } = req.body;

      const novaPolitica = await PoliticaCadastro.create({
        nome,
        ativo,
        campoResultado,
        valorResultado
      }).fetch();

      const condicoesPromises = condicoes.map(condicao => {
        return CondicaoCadastro.create({
          campo: condicao.campo,
          operador: condicao.operador,
          valor: condicao.valor,
          politicaCadastro: novaPolitica.id
        });
      });

      await Promise.all(condicoesPromises);

      return res.status(201).json({
        message: 'Política de cadastro criada com sucesso',
        politica: novaPolitica
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { nome, ativo, condicoes, campoResultado, valorResultado } = req.body;
      const politicaId = req.params.id;

      const politicaAtualizada = await PoliticaCadastro.updateOne({ id: politicaId }).set({
        nome,
        ativo,
        campoResultado,
        valorResultado
      });

      if (!politicaAtualizada) {
        return res.notFound('Política de cadastro não encontrada.');
      }

      // Remove as condições existentes
      await CondicaoCadastro.destroy({ politicaCadastro: politicaId });

      // Adiciona as novas condições
      const condicoesPromises = condicoes.map(condicao => {
        return CondicaoCadastro.create({
          campo: condicao.campo,
          operador: condicao.operador,
          valor: condicao.valor,
          politicaCadastro: politicaId
        });
      });

      await Promise.all(condicoesPromises);

      return res.json({
        message: 'Política de cadastro atualizada com sucesso',
        politica: politicaAtualizada
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const politicaId = req.params.id;

      // Remove as condições associadas primeiro
      await CondicaoCadastro.destroy({ politicaCadastro: politicaId });

      // Agora remove a política
      const politicaDeletada = await PoliticaCadastro.destroyOne({ id: politicaId });

      if (!politicaDeletada) {
        return res.notFound('Política de cadastro não encontrada.');
      }

      return res.json({
        message: 'Política de cadastro deletada com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  todos: async function (req, res) {
    try {
      const politicas = await PoliticaCadastro.find().populate('condicoes');
      return res.json(politicas);
    } catch (err) {
      return res.serverError(err);
    }
  }
};
