module.exports = {
  criar: async function (req, res) {
    try {
      const { nome, descricao, codigo } = req.body;
      let { ativo } = req.body;

      // Verifica se o campo "ativo" está presente na requisição e converte para booleano
      ativo = ativo === 'on';

      // Verifica se já existe uma organização com o mesmo código
      const organizacaoExistente = await OrganizacaoVendas.findOne({ codigo });
      if (organizacaoExistente) {
        return res.status(400).json({ error: 'Código já existe.' });
      }

      const novaOrganizacao = await OrganizacaoVendas.create({ nome, descricao, codigo, ativo }).fetch();
      return res.status(201).json({
        message: 'Organização de Vendas criada com sucesso!',
        data: novaOrganizacao
      });
    } catch (err) {
      return res.serverError({
        error: 'Erro ao criar a Organização de Vendas',
        details: err.message
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const organizacaoId = req.params.id;
      const { nome, descricao, codigo, ativo } = req.body;

      // Verifica se o campo "ativo" está presente na requisição e converte para booleano
      const ativoBoolean = ativo === 'on' || ativo === true;

      // Verifica se o código já existe em outra organização
      const organizacaoExistente = await OrganizacaoVendas.findOne({ codigo, id: { '!=': organizacaoId } });
      if (organizacaoExistente) {
        return res.status(400).json({ error: 'Código já existe.' });
      }

      const updatedOrganizacao = await OrganizacaoVendas.updateOne({ id: organizacaoId }).set({ nome, descricao, codigo, ativo: ativoBoolean });
      if (!updatedOrganizacao) {
        return res.notFound({
          error: 'Organização de Vendas não encontrada'
        });
      }
      return res.json({
        message: 'Organização de Vendas atualizada com sucesso!',
        data: updatedOrganizacao
      });
    } catch (err) {
      return res.serverError({
        error: 'Erro ao atualizar a Organização de Vendas',
        details: err.message
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const organizacaoId = req.params.id;
      const deletedOrganizacao = await OrganizacaoVendas.destroyOne({ id: organizacaoId });
      if (!deletedOrganizacao) {
        return res.notFound({
          error: 'Organização de Vendas não encontrada'
        });
      }
      return res.json({
        message: 'Organização de Vendas excluída com sucesso!'
      });
    } catch (err) {
      return res.serverError({
        error: 'Erro ao excluir a Organização de Vendas',
        details: err.message
      });
    }
  },

  listar: async function (req, res) {
    try {
      let { codigo, descricao, page } = req.query;
      const organizacoesPorPagina = 8;

      page = parseInt(page);

      if (isNaN(page) || page < 1) {
        page = 1;
      }

      const filtro = {};

      if (codigo) filtro.codigo = { contains: codigo };
      if (descricao) filtro.descricao = { contains: descricao };

      const totalOrganizacoes = await OrganizacaoVendas.count(filtro);
      const totalPages = Math.ceil(totalOrganizacoes / organizacoesPorPagina);
      const startIndex = (page - 1) * organizacoesPorPagina;

      const organizacoes = await OrganizacaoVendas.find({
        where: filtro,
        limit: organizacoesPorPagina,
        skip: startIndex
      });

      return res.view('pages/organizacaoVendas/listar', {
        organizacoes, codigo, descricao, totalPages, currentPage: page
      });
    } catch (err) {
      return res.serverError({
        error: 'Erro ao listar as Organizações de Vendas',
        details: err.message
      });
    }
  },
};
