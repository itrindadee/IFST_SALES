module.exports = {
  listar: async function (req, res) {
    try {
      const permissoes = await Permissao.find();
      return res.view('pages/permissao/listar', { permissoes });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar as permissões.',
        error: err.message
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const permissao = await Permissao.findOne({ id: req.params.id });
      if (!permissao) {
        return res.notFound({
          message: 'Permissão não encontrada.'
        });
      }
      return res.json(permissao);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar a permissão.',
        error: err.message
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { nome, descricao, tipoPermissao } = req.body;
      const novaPermissao = await Permissao.create({
        nome,
        descricao,
        tipoPermissao
      }).fetch();

      return res.status(201).json({
        message: 'Permissão criada com sucesso',
        permissao: novaPermissao
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar a permissão.',
        error: err.message
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { nome, descricao, tipoPermissao } = req.body;
      const permissaoId = req.params.id;

      const permissaoAtualizada = await Permissao.updateOne({ id: permissaoId }).set({
        nome,
        descricao,
        tipoPermissao
      });

      if (!permissaoAtualizada) {
        return res.notFound({
          message: 'Permissão não encontrada.'
        });
      }

      return res.json({
        message: 'Permissão atualizada com sucesso',
        permissao: permissaoAtualizada
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar a permissão.',
        error: err.message
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const permissaoId = req.params.id;

      const permissaoDeletada = await Permissao.destroyOne({ id: permissaoId });

      if (!permissaoDeletada) {
        return res.notFound({
          message: 'Permissão não encontrada.'
        });
      }

      return res.json({
        message: 'Permissão deletada com sucesso'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar a permissão.',
        error: err.message
      });
    }
  }
};
