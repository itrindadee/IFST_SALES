module.exports = {
  criar: async function (req, res) {
    try {
      const { codigo, razaoSocial, cnpj, endereco } = req.body;
      if (!codigo || !razaoSocial || !cnpj) {
        return res.badRequest('Por favor, forneça todos os campos obrigatórios.');
      }

      const novaEmpresa = await Empresa.create({ codigo, razaoSocial, cnpj, endereco }).fetch();
      return res.status(201).json({ message: 'Empresa cadastrada com sucesso', empresa: novaEmpresa });
    } catch (err) {
      if (err.code === 'E_UNIQUE') {
        return res.status(400).json({ error: 'Código ou CNPJ já existe.' });
      }
      return res.serverError(err);
    }
  },

  listar: async function (req, res) {
    try {
      let { codigo, razaoSocial, cnpj, page } = req.query;
      const empresasPorPagina = 8;
      page = parseInt(page);
      if (isNaN(page) || page < 1) page = 1;

      const filtro = {};
      if (codigo) filtro.codigo = { contains: codigo };
      if (razaoSocial) filtro.razaoSocial = { contains: razaoSocial };
      if (cnpj) filtro.cnpj = { contains: cnpj };

      const totalEmpresas = await Empresa.count(filtro);
      const totalPages = Math.ceil(totalEmpresas / empresasPorPagina);
      const startIndex = (page - 1) * empresasPorPagina;

      const empresas = await Empresa.find({ where: filtro, limit: empresasPorPagina, skip: startIndex });

      return res.view('pages/empresa/listar', { empresas, codigo, razaoSocial, cnpj, totalPages, currentPage: page });
    } catch (err) {
      return res.serverError(err);
    }
  },

  editar: async function (req, res) {
    try {
      var empresaId = req.params.id;
      var empresa = await Empresa.findOne({ id: empresaId });
      return res.view('pages/empresas/editar', { empresa });
    } catch (err) {
      return res.serverError(err);
    }
  },

  atualizar: async function (req, res) {
    try {
      const { id, codigo, razaoSocial, cnpj, endereco } = req.body;
      if (id) {
        await Empresa.updateOne({ id }).set({ codigo, razaoSocial, cnpj, endereco });
        return res.json({ message: 'Empresa atualizada com sucesso' });
      } else {
        return res.badRequest('ID da empresa não fornecido.');
      }
    } catch (err) {
      if (err.code === 'E_UNIQUE') {
        return res.status(400).json({ error: 'Código ou CNPJ já existe.' });
      }
      return res.serverError(err);
    }
  },

  deletar: async function (req, res) {
    try {
      var empresaId = req.params.id;
      await Empresa.destroyOne({ id: empresaId });
      return res.json({ message: 'Empresa deletada com sucesso' });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
