module.exports = {
    async listar(req, res) {
      try {
        let { nome, descricao, page } = req.query;
        const perfisPorPagina = 8;
        page = parseInt(page);
        if (isNaN(page) || page < 1) page = 1;

        const filtro = {};
        if (nome) filtro.nome = { contains: nome };
        if (descricao) filtro.descricao = { contains: descricao };

        const totalPerfis = await Perfil.count(filtro);
        const totalPages = Math.ceil(totalPerfis / perfisPorPagina);
        const startIndex = (page - 1) * perfisPorPagina;

        const perfis = await Perfil.find({ where: filtro, limit: perfisPorPagina, skip: startIndex }).populate('permissoes');
        const permissoesDisponiveis = await Permissao.find();

          const perfisComPermissoes = perfis.map(perfil => {
          const permissoesAtribuidas = perfil.permissoes ? perfil.permissoes.map(permissao => permissao.id) : [];
          const permissoesNaoAtribuidas = permissoesDisponiveis.filter(permissao => !permissoesAtribuidas.includes(permissao.id));
          return {
            ...perfil,
            permissoesNaoAtribuidas
          };
        });

        return res.view('pages/perfil/listar', { perfis: perfisComPermissoes, nome, descricao, totalPages, currentPage: page, permissoesDisponiveis });
      } catch (error) {
        return res.serverError(error);
      }
    },

  // Action para exibir o formulário de criação de perfil
  async criar(req, res) {
    try {
      const { nome, descricao } = req.body;
      if (!nome) {
        return res.badRequest('Por favor, forneça o nome do perfil.');
      }

      const novoPerfil = await Perfil.create({ nome, descricao }).fetch();
      return res.status(201).json({ message: 'Perfil cadastrado com sucesso', perfil: novoPerfil });
    } catch (err) {
      return res.serverError(err);
    }
  },


  // Action para atualizar um perfil
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      // Validação simples dos dados recebidos
      if (!id || !nome) {
        return res.badRequest({ message: 'ID e nome são obrigatórios.' });
      }

      // Atualiza o perfil no banco de dados
      const perfilAtualizado = await Perfil.updateOne({ id }).set({ nome, descricao });

      // Verifica se o perfil foi encontrado e atualizado
      if (!perfilAtualizado) {
        return res.notFound({ message: 'Perfil não encontrado.' });
      }

      // Retorna apenas os dados atualizados do perfil
      return res.status(201).json({ perfil: perfilAtualizado });

    } catch (error) {
      // Retorna um erro de servidor em caso de exceção
      return res.serverError(error);
    }
  },

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const perfil = await Perfil.findOne({ id });

      if (!perfil) {
        return res.notFound({ message: 'Perfil não encontrado.' });
      }

      return res.json(perfil);
    } catch (error) {
      return res.serverError(error);
    }
  },

  // Action para deletar um perfil
  async deletar(req, res) {
    try {
      const perfilId = req.params.id;
      const deletarPerfil = await Perfil.destroyOne({ id: perfilId });
      if (!deletarPerfil) {
        return res.notFound({ message: 'Perfil não encontrada' });
      }
      return res.json({ message: 'Perfil excluída com sucesso' });
    } catch (err) {
      return res.serverError(err);
    }
  },

async adicionarpermissao(req, res) {
  try {
    const { perfilId, permissaoId } = req.body;

    const perfil = await Perfil.findOne({ id: perfilId }).populate('permissoes');
    if (!perfil) return res.notFound();

    const permissao = await Permissao.findOne({ id: permissaoId });
    if (!permissao) return res.notFound();

    await Perfil.addToCollection(perfilId, 'permissoes').members([permissaoId]);

    return res.redirect('/perfis/listar');
  } catch (error) {
    return res.serverError(error);
  }
},
async removerpermissao(req, res) {
  try {
    const { perfilId, permissaoId } = req.body;

    const perfil = await Perfil.findOne({ id: perfilId }).populate('permissoes');
    if (!perfil) return res.notFound();

    const permissao = await Permissao.findOne({ id: permissaoId });
    if (!permissao) return res.notFound();

    await Perfil.removeFromCollection(perfilId, 'permissoes').members([permissaoId]);

    return res.redirect('/perfis/listar');
  } catch (error) {
    return res.serverError(error);
  }
}
};
