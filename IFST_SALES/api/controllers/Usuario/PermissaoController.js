// PermissaoController.js

module.exports = {
  // Listar todas as permissões
  async listar(req, res) {
    try {
      let { nome, descricao, page } = req.query;
      const permissoesPorPagina = 8;
      page = parseInt(page);
      if (isNaN(page) || page < 1) page = 1;

      const filtro = {};
      if (nome) filtro.nome = { contains: nome };
      if (descricao) filtro.descricao = { contains: descricao };

      const totalPermissoes = await Permissao.count(filtro);
      const totalPages = Math.ceil(totalPermissoes / permissoesPorPagina);
      const startIndex = (page - 1) * permissoesPorPagina;

      const permissoes = await Permissao.find({ where: filtro, limit: permissoesPorPagina, skip: startIndex });

      return res.view('pages/permissao/listar', { permissoes, nome, descricao, totalPages, currentPage: page });
    } catch (error) {
      return res.serverError(error);
    }
  },

  // Criar uma nova permissão
  async criar(req, res) {
    try {
      const permissaoCriada = await Permissao.create(req.body).fetch();
      return res.status(201).json(permissaoCriada);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar a permissão.' });
    }
  },

  // Buscar uma permissão por ID
  async buscar(req, res) {
    const { id } = req.params;
    try {
      const permissao = await Permissao.findOne({ id });
      if (!permissao) {
        return res.status(404).json({ error: 'Permissão não encontrada.' });
      }
      return res.json(permissao);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar a permissão.' });
    }
  },

  // Atualizar uma permissão por ID
  async atualizar(req, res) {
    const { id } = req.params;
    try {
      const permissaoAtualizada = await Permissao.updateOne({ id }).set(req.body);
      if (!permissaoAtualizada) {
        return res.status(404).json({ error: 'Permissão não encontrada.' });
      }
      return res.json(permissaoAtualizada);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar a permissão.' });
    }
  },

  // Excluir uma permissão por ID
  async excluir(req, res) {
    const { id } = req.params;
    try {
      const permissaoExcluida = await Permissao.destroyOne({ id });
      if (!permissaoExcluida) {
        return res.status(404).json({ error: 'Permissão não encontrada.' });
      }
      return res.json({ message: 'Permissão excluída com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir a permissão.' });
    }
  },
};
