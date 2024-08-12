module.exports = {
  criar: async function (req, res) {
    try {
      const { codigo, nome } = req.body;
      if (!codigo || !nome) {
        return res.badRequest('Por favor, forneça todos os campos obrigatórios.');
      }

      const novoGrupoEmpresa = await GrupoEmpresa.create({ codigo, nome }).fetch();
      return res.status(201).json({ message: 'Grupo Empresa cadastrado com sucesso', grupoEmpresa: novoGrupoEmpresa });
    } catch (err) {
      if (err.code === 'E_UNIQUE') {
        return res.status(400).json({ error: 'Código já existe.' });
      }
      return res.serverError(err);
    }
  },

  listar: async function (req, res) {
    try {
      let { codigo, nome, page } = req.query;
      const gruposEmpresasPorPagina = 8;
      page = parseInt(page);
      if (isNaN(page) || page < 1) page = 1;

      const filtro = {};
      if (codigo) filtro.codigo = { contains: codigo };
      if (nome) filtro.nome = { contains: nome };

      const totalGruposEmpresas = await GrupoEmpresa.count(filtro);
      const totalPages = Math.ceil(totalGruposEmpresas / gruposEmpresasPorPagina);
      const startIndex = (page - 1) * gruposEmpresasPorPagina;

      const gruposEmpresas = await GrupoEmpresa.find({ where: filtro, limit: gruposEmpresasPorPagina, skip: startIndex });

      return res.view('pages/grupoEmpresa/listar', { gruposEmpresas, codigo, nome, totalPages, currentPage: page });
    } catch (err) {
      return res.serverError(err);
    }
  },

  editar: async function (req, res) {
    try {
      var grupoEmpresaId = req.params.id;
      var grupoEmpresa = await GrupoEmpresa.findOne({ id: grupoEmpresaId });
      return res.view('pages/grupoEmpresa/editar', { grupoEmpresa });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { id, codigo, nome } = req.body;
      if (id) {
        await GrupoEmpresa.updateOne({ id }).set({ codigo, nome });
        return res.json({ message: 'Grupo Empresa atualizado com sucesso' });
      } else {
        return res.badRequest('ID do Grupo Empresa não fornecido.');
      }
    } catch (err) {
      if (err.code === 'E_UNIQUE') {
        return res.status(400).json({ error: 'Código já existe.' });
      }
      return res.serverError(err);
    }
  },

  todos: async function (req, res) {
    try {
      const gruposEmpresas = await GrupoEmpresa.find();
      return res.json(gruposEmpresas);
    } catch (err) {
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      var grupoEmpresaId = req.params.id;
      await GrupoEmpresa.destroyOne({ id: grupoEmpresaId });
      return res.json({ message: 'Grupo Empresa deletado com sucesso' });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
