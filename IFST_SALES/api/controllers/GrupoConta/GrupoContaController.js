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
      return res.serverError({ message: 'Erro ao listar grupos de conta', error: err });
    }
  },

  criar: async function (req, res) {
    try {
      const { codigo, descricao } = req.body;

      if (!codigo || !descricao) {
        return res.badRequest({ message: 'Por favor, forneça todos os campos obrigatórios.' });
      }

      // Verificar se o código já existe
      const codigoExistente = await GrupoConta.findOne({ codigo });
      if (codigoExistente) {
        return res.status(400).json({ message: 'Código já existe.' });
      }

      const novoGrupo = await GrupoConta.create({
        codigo,
        descricao
      }).fetch();

      return res.status(201).json({
        message: 'Grupo Conta criado com sucesso',
        grupo: novoGrupo
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao criar grupo de conta', error: err });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { codigo, descricao } = req.body;
      const grupoId = req.params.id;

      if (!codigo || !descricao) {
        return res.badRequest({ message: 'Por favor, forneça todos os campos obrigatórios.' });
      }

      // Verificar se o código já existe para outro grupo
      const codigoExistente = await GrupoConta.findOne({ codigo, id: { '!=': grupoId } });
      if (codigoExistente) {
        return res.status(400).json({ message: 'Código já existe.' });
      }

      const grupoAtualizado = await GrupoConta.updateOne({ id: grupoId }).set({
        codigo,
        descricao
      });

      if (!grupoAtualizado) {
        return res.notFound({ message: 'Grupo Conta não encontrado.' });
      }

      return res.json({
        message: 'Grupo Conta atualizado com sucesso',
        grupo: grupoAtualizado
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao atualizar grupo de conta', error: err });
    }
  },

  deletar: async function (req, res) {
    try {
      const grupoId = req.params.id;

      const grupoDeletado = await GrupoConta.destroyOne({ id: grupoId });

      if (!grupoDeletado) {
        return res.notFound({ message: 'Grupo Conta não encontrado.' });
      }

      return res.json({
        message: 'Grupo Conta deletado com sucesso'
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao deletar grupo de conta', error: err });
    }
  },

  todos: async function (req, res) {
    try {
      const grupos = await GrupoConta.find();
      return res.json(grupos);
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar todos os grupos de conta', error: err });
    }
  }
};
