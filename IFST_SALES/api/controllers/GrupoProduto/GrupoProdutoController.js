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
  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { codigo, descricao } = req.body;

      if (!codigo || !descricao) {
        return res.badRequest({ message: 'Por favor, forneça todos os campos obrigatórios.' });
      }

      // Verificar se o código já existe
      const codigoExistente = await GrupoProduto.findOne({ codigo });
      if (codigoExistente) {
        return res.status(400).json({ type: 'UniqueConstraintError', message: 'Código já existe.' });
      }

      const novoGrupoProduto = await GrupoProduto.create({
        codigo,
        descricao,
        createdBy: { id: userId, fullName }
      }).fetch();

      return res.status(201).json({
        message: 'Grupo Produto cadastrado com sucesso',
        grupoProduto: novoGrupoProduto
      });
    } catch (err) {
      return res.serverError({ type: 'ServerError', message: 'Erro ao criar grupo produto', error: err.message });
    }
  },

  listar: async function (req, res) {
    try {
      let { codigo, descricao, page } = req.query;
      const gruposProdutosPorPagina = 8;
      page = parseInt(page);
      if (isNaN(page) || page < 1) page = 1;

      const filtro = {};
      if (codigo) filtro.codigo = { contains: codigo };
      if (descricao) filtro.descricao = { contains: descricao };

      const totalGruposProduto = await GrupoProduto.count(filtro);
      const totalPages = Math.ceil(totalGruposProduto / gruposProdutosPorPagina);
      const startIndex = (page - 1) * gruposProdutosPorPagina;

      const gruposProduto = await GrupoProduto.find({
        where: filtro,
        limit: gruposProdutosPorPagina,
        skip: startIndex
      });

      return res.view('pages/grupoProduto/listar', { gruposProduto, codigo, descricao, totalPages, currentPage: page });
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar grupos de produtos', error: err.message });
    }
  },

  editar: async function (req, res) {
    try {
      const grupoProdutoId = req.params.id;
      const grupoProduto = await GrupoProduto.findOne({ id: grupoProdutoId });

      if (!grupoProduto) {
        return res.notFound({ type: 'NotFoundError', message: 'Grupo Produto não encontrado.' });
      }

      return res.view('pages/grupoProduto/editar', { grupoProduto });
    } catch (err) {
      return res.serverError({ type: 'ServerError', message: 'Erro ao buscar grupo de produto', error: err.message });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { id, codigo, descricao } = req.body;

      if (!id) {
        return res.badRequest({ type: 'ValidationError', message: 'ID do Grupo Produto não fornecido.' });
      }

      // Verificar se o código já existe para outro grupo
      const codigoExistente = await GrupoProduto.findOne({ codigo, id: { '!=': id } });
      if (codigoExistente) {
        return res.status(400).json({ type: 'UniqueConstraintError', message: 'Código já existe.' });
      }

      const grupoProdutoAtualizado = await GrupoProduto.updateOne({ id }).set({
        codigo,
        descricao,
        updatedBy: { id: userId, fullName }
      });
      if (!grupoProdutoAtualizado) {
        return res.notFound({ type: 'NotFoundError', message: 'Grupo Produto não encontrado.' });
      }

      return res.json({
        message: 'Grupo Produto atualizado com sucesso',
        grupoProduto: grupoProdutoAtualizado
      });
    } catch (err) {
      return res.serverError({ type: 'ServerError', message: 'Erro ao atualizar grupo de produto', error: err.message });
    }
  },

  todos: async function (req, res) {
    try {
      const gruposProdutos = await GrupoProduto.find();
      return res.json(gruposProdutos);
    } catch (err) {
      return res.serverError({ type: 'ServerError', message: 'Erro ao listar todos os grupos de produtos', error: err.message });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const grupoProdutoId = req.params.id;

      const grupoProdutoDeletado = await GrupoProduto.destroyOne({ id: grupoProdutoId });

      if (!grupoProdutoDeletado) {
        return res.notFound({ type: 'NotFoundError', message: 'Grupo Produto não encontrado.' });
      }

      return res.json({
        message: 'Grupo Produto deletado com sucesso'
      });
    } catch (err) {
      return res.serverError({ type: 'ServerError', message: 'Erro ao deletar grupo de produto', error: err.message });
    }
  }
};
