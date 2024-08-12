/**
 * GrupoContaController.js
 *
 * @description :: Server-side actions for handling incoming requests.
 * @docs        :: https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  listar: async function (req, res) {
    try {
      const grupos = await GrupoConta.find();
      return res.view('pages/grupoConta/listar', { grupos });
    } catch (err) {
      return res.serverError(err);
    }
  },

  criar: async function (req, res) {
    try {
      const { codigo, descricao } = req.body;

      const novoGrupo = await GrupoConta.create({
        codigo,
        descricao
      }).fetch();

      return res.status(201).json({
        message: 'Grupo Conta criado com sucesso',
        grupo: novoGrupo
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { codigo, descricao } = req.body;
      const grupoId = req.params.id;

      const grupoAtualizado = await GrupoConta.updateOne({ id: grupoId }).set({
        codigo,
        descricao
      });

      if (!grupoAtualizado) {
        return res.notFound('Grupo Conta não encontrado.');
      }

      return res.json({
        message: 'Grupo Conta atualizado com sucesso',
        grupo: grupoAtualizado
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      const grupoId = req.params.id;

      const grupoDeletado = await GrupoConta.destroyOne({ id: grupoId });

      if (!grupoDeletado) {
        return res.notFound('Grupo Conta não encontrado.');
      }

      return res.json({
        message: 'Grupo Conta deletado com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  todos: async function (req, res) {
    try {
      const grupos = await GrupoConta.find();
      return res.json(grupos);
    } catch (err) {
      return res.serverError(err);
    }
  }
};
