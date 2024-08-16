// controllers/PerfilController.js

module.exports = {
  // Método para listar todos os perfis e todas as permissões
  listar: async function (req, res) {
    try {
      const perfis = await Perfil.find().populate('permissoes');
      const permissoes = await Permissao.find();
      return res.view('pages/perfil/listar', { perfis, permissoes });
    } catch (err) {
      return res.serverError(err);
    }
  },

  // Método para criar um novo perfil
  criar: async function (req, res) {
    try {
      const { nome, descricao, permissoes } = req.body;

      // Criar o perfil sem as permissões inicialmente
      const novoPerfil = await Perfil.create({
        nome,
        descricao
      }).fetch();

      // Verificar se há permissões para associar
      if (permissoes && permissoes.length > 0) {
        // Adicionar permissões ao perfil recém-criado
        await Perfil.addToCollection(novoPerfil.id, 'permissoes').members(permissoes);
      }

      return res.status(201).json({
        message: 'Perfil criado com sucesso',
        perfil: novoPerfil
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  // Método para buscar (visualizar) um perfil específico
  buscar: async function (req, res) {
    try {
      const perfilId = req.params.id;

      // Buscar o perfil com as permissões associadas
      const perfil = await Perfil.findOne({ id: perfilId }).populate('permissoes');

      if (!perfil) {
        return res.notFound('Perfil não encontrado.');
      }

      // Buscar todas as permissões disponíveis
      const todasPermissoes = await Permissao.find();

      // Retornar o perfil, as permissões associadas e todas as permissões disponíveis
      return res.json({
        perfil: perfil,
        permissoesAssociadas: perfil.permissoes, // Permissões associadas ao perfil
        todasPermissoes: todasPermissoes // Todas as permissões disponíveis
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  // Método para atualizar um perfil existente
  atualizar: async function (req, res) {
    try {
      const { id, nome, descricao, permissoes } = req.body;
      const perfilId = req.params.id;

      const perfilAtualizado = await Perfil.updateOne({ id: perfilId }).set({
        id,
        nome,
        descricao
      });

      if (!perfilAtualizado) {
        return res.notFound('Perfil não encontrado.');
      }
      // Atualizando as permissões associadas ao perfil
      const permissoesArray = Array.isArray(permissoes) ? permissoes : [];
      if (permissoesArray.length > 0) {
        await Perfil.replaceCollection(perfilId, 'permissoes').members(permissoesArray);
      } else {
        await Perfil.replaceCollection(perfilId, 'permissoes').members([]);
      }
      return res.json({
        message: 'Perfil atualizado com sucesso',
        perfil: perfilAtualizado
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  // Método para deletar um perfil
  deletar: async function (req, res) {
    try {
      const perfilId = req.params.id;

      // Buscar as permissões associadas ao perfil
      const perfil = await Perfil.findOne({ id: perfilId }).populate('permissoes');
      const permissoesAssociadas = perfil.permissoes.map(permissao => permissao.id);

      // Remover todas as permissões associadas ao perfil antes de deletá-lo
      await Perfil.removeFromCollection(perfilId, 'permissoes').members(permissoesAssociadas);

      // Deletar o perfil
      const perfilDeletado = await Perfil.destroyOne({ id: perfilId });

      if (!perfilDeletado) {
        return res.notFound('Perfil não encontrado.');
      }

      return res.json({
        message: 'Perfil deletado com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
