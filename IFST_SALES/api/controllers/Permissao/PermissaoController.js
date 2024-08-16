module.exports = {
  // Método para listar todas as permissões
  listar: async function (req, res) {
    try {
      const permissoes = await Permissao.find();
      return res.view('pages/permissao/listar', { permissoes });
    } catch (err) {
      return res.serverError(err);
    }
  },

  // Método para buscar uma permissão específica
  buscar: async function (req, res) {
    try {
      const permissao = await Permissao.findOne({ id: req.params.id });
      if (!permissao) {
        return res.notFound('Permissão não encontrada.');
      }
      return res.json(permissao);
    } catch (err) {
      return res.serverError(err);
    }
  },

  // Método para criar uma nova permissão
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
      return res.serverError(err);
    }
  },

  // Método para atualizar uma permissão existente
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
        return res.notFound('Permissão não encontrada.');
      }

      return res.json({
        message: 'Permissão atualizada com sucesso',
        permissao: permissaoAtualizada
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  // Método para deletar uma permissão
  deletar: async function (req, res) {
    try {
      const permissaoId = req.params.id;

      const permissaoDeletada = await Permissao.destroyOne({ id: permissaoId });

      if (!permissaoDeletada) {
        return res.notFound('Permissão não encontrada.');
      }

      return res.json({
        message: 'Permissão deletada com sucesso'
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
