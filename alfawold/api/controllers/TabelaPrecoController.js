// api/controllers/TabelaPrecoController.js

module.exports = {

  // Função para listar todos os itens de tabela de preço
  listar: async function (req, res) {
    try {
      let { nome, descricao, page } = req.query;
      const tabelasPorPagina = 8;

      page = parseInt(page);

      if (isNaN(page) || page < 1) {
        page = 1;
      }

      const filtro = {};

      if (nome) filtro.nome = { contains: nome };
      if (descricao) filtro.descricao = { contains: descricao };

      const totalTabelas = await TabelaPreco.count(filtro);
      const totalPages = Math.ceil(totalTabelas / tabelasPorPagina);
      const startIndex = (page - 1) * tabelasPorPagina;

      const tabelas = await TabelaPreco.find({
        where: filtro,
        limit: tabelasPorPagina,
        skip: startIndex
      });

      return res.view('pages/tabelapreco/listar', {
        tabelas,
        nome,
        descricao,
        currentPage: page,
        totalPages
      });
    } catch (error) {
      return res.serverError(error);
    }
  },

  editar: async function (req, res) {
    try {
      // Obter o ID da tabela de preço a ser editada
      var tabelaPrecoId = req.params.id;

      // Buscar a tabela de preço no banco de dados
      var tabelaPreco = await TabelaPreco.findOne({ id: tabelaPrecoId });

      // Verificar se a tabela de preço foi encontrada
      if (!tabelaPreco) {
        return res.status(404).json({ error: 'Tabela de Preço não encontrada' });
      }

      // Renderizar a view e passar a tabela de preço como contexto
      return res.view('pages/tabelapreco/editar', { tabelaPreco: tabelaPreco });
    } catch (err) {
      return res.serverError(err);
    }
},
  // Função para criar um novo item de tabela de preço
  async criar(req, res) {
    try {
      // Verifica se o campo "ativo" está presente no corpo da solicitação
      const ativo = req.body.ativo === 'on'; // Se estiver marcado, será 'on', senão será undefined ou não estará presente
      const tabela = await TabelaPreco.create({ ...req.body, ativo }).fetch();
      return res.status(201).json(tabela);
    } catch (err) {
      return res.serverError(err);
    }
  },
  // Função para atualizar um item de tabela de preço
  async atualizar(req, res) {
    try {
      const tabela = await TabelaPreco.updateOne({ id: req.params.id })
        .set(req.body);
      if (!tabela) {
        return res.notFound('Tabela de preço não encontrada');
      }
      return res.json(tabela);
    } catch (err) {
      return res.serverError(err);
    }
  },

  // Função para deletar um item de tabela de preço
  async deletar(req, res) {
    try {
      const tabela = await TabelaPreco.destroyOne({ id: req.params.id });
      if (!tabela) {
        return res.notFound('Tabela de preço não encontrada');
      }
      return res.json({ mensagem: 'Tabela de preço deletada com sucesso' });
    } catch (err) {
      return res.serverError(err);
    }
  }

};
