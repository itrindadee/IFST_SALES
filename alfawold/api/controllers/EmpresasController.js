// api/controllers/EmpresaController.js

module.exports = {
  // Ação para criar uma nova empresa
  criar: async function (req, res) {
    try {
      const { codigo, razaoSocial, cnpj, endereco } = req.body;

      // Verifica se os campos obrigatórios estão presentes
      if (!codigo || !razaoSocial || !cnpj) {
        return res.badRequest('Por favor, forneça todos os campos obrigatórios.');
      }

      // Cria uma nova empresa com os dados fornecidos
      const novaEmpresa = await Empresa.create({
        codigo,
        razaoSocial,
        cnpj,
        endereco
      }).fetch();

      // Retorna uma resposta de sucesso com os dados da nova empresa
      return res.status(201).json({ message: 'Empresa cadastrada com sucesso', empresa: novaEmpresa });
    } catch (err) {
      // Retorna um erro de servidor em caso de falha
      return res.serverError(err);
    }
  },

  // Ação para listar todas as empresas com paginação e filtros
  listar: async function (req, res) {
    try {
      let { codigo, razaoSocial, cnpj, page } = req.query;
      const empresasPorPagina = 8;

      page = parseInt(page);

      if (isNaN(page) || page < 1) {
        page = 1;
      }

      const filtro = {};

      if (codigo) filtro.codigo = { contains: codigo };
      if (razaoSocial) filtro.razaoSocial = { contains: razaoSocial };
      if (cnpj) filtro.cnpj = { contains: cnpj };

      const totalEmpresas = await Empresa.count(filtro);
      const totalPages = Math.ceil(totalEmpresas / empresasPorPagina);
      const startIndex = (page - 1) * empresasPorPagina;

      const empresas = await Empresa.find({
        where: filtro,
        limit: empresasPorPagina,
        skip: startIndex
      });

      return res.view('pages/empresas/listar', {
        empresas, codigo, razaoSocial, cnpj, totalPages, currentPage: page
      });
    } catch (err) {
      return res.serverError(err);
    }
  },
  editar: async function(req, res) {
    try {
      // Obter o ID da empresa a ser editada
      var empresaId = req.params.id;

      // Buscar a empresa no banco de dados
      var empresa = await Empresa.findOne({ id: empresaId });

      // Renderizar a view e passar a empresa como contexto
      return res.view('pages/empresas/editar', { empresa: empresa });
    } catch (err) {
      return res.serverError(err);
    }
  },
  atualizar: async function(req, res) {
    try {
      const {
        empresaId, codigo, razaoSocial, cnpj, endereco
      } = req.body;

      if (empresaId) {
        await Empresa.updateOne({ id: empresaId }).set({
          codigo, razaoSocial, cnpj, endereco
        });
        return res.json({ message: 'Empresa atualizada com sucesso' });
      } else {
        const novaEmpresa = await Empresa.create({
          codigo, razaoSocial, cnpj, endereco
        }).fetch();

        return res.status(201).json({ message: 'Empresa cadastrada com sucesso', empresa: novaEmpresa });
      }
    } catch (err) {
      return res.serverError(err);
    }
  },

  // Ação para listar todas as empresas sem filtros e paginação
  listarTodasEmpresas: async function(req, res) {
    try {
      const empresas = await Empresa.find();
      return empresas;
    } catch (err) {
      console.error('Erro no servidor:', err);
      throw err;
    }
  }
};
