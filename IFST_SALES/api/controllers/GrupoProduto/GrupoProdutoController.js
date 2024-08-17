// api/controllers/GrupoEmpresaController.js

module.exports = {
  criar: async function (req, res) {
    try {
      const { codigo, nome } = req.body;

      if (!codigo || !nome) {
        return res.badRequest({ message: 'Por favor, forneça todos os campos obrigatórios.' });
      }

      // Verificar se o código já existe
      const codigoExistente = await GrupoEmpresa.findOne({ codigo });
      if (codigoExistente) {
        return res.status(400).json({ message: 'Código já existe.' });
      }

      const novoGrupoEmpresa = await GrupoEmpresa.create({ codigo, nome }).fetch();
      return res.status(201).json({
        message: 'Grupo Empresa cadastrado com sucesso',
        grupoEmpresa: novoGrupoEmpresa
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao criar grupo empresa', error: err });
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

      const gruposEmpresas = await GrupoEmpresa.find({
        where: filtro,
        limit: gruposEmpresasPorPagina,
        skip: startIndex
      });

      return res.view('pages/grupoEmpresa/listar', { gruposEmpresas, codigo, nome, totalPages, currentPage: page });
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar grupos empresa', error: err });
    }
  },

  editar: async function (req, res) {
    try {
      const grupoEmpresaId = req.params.id;
      const grupoEmpresa = await GrupoEmpresa.findOne({ id: grupoEmpresaId });

      if (!grupoEmpresa) {
        return res.notFound({ message: 'Grupo Empresa não encontrado.' });
      }

      return res.view('pages/grupoEmpresa/editar', { grupoEmpresa });
    } catch (err) {
      return res.serverError({ message: 'Erro ao buscar grupo empresa', error: err });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { id, codigo, nome } = req.body;

      if (!id) {
        return res.badRequest({ message: 'ID do Grupo Empresa não fornecido.' });
      }

      // Verificar se o código já existe para outro grupo
      const codigoExistente = await GrupoEmpresa.findOne({ codigo, id: { '!=': id } });
      if (codigoExistente) {
        return res.status(400).json({ message: 'Código já existe.' });
      }

      const grupoEmpresaAtualizado = await GrupoEmpresa.updateOne({ id }).set({ codigo, nome });
      if (!grupoEmpresaAtualizado) {
        return res.notFound({ message: 'Grupo Empresa não encontrado.' });
      }

      return res.json({
        message: 'Grupo Empresa atualizado com sucesso',
        grupoEmpresa: grupoEmpresaAtualizado
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao atualizar grupo empresa', error: err });
    }
  },

  todos: async function (req, res) {
    try {
      const gruposEmpresas = await GrupoEmpresa.find();
      return res.json(gruposEmpresas);
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar todos os grupos empresa', error: err });
    }
  },

  deletar: async function (req, res) {
    try {
      const grupoEmpresaId = req.params.id;

      const grupoEmpresaDeletado = await GrupoEmpresa.destroyOne({ id: grupoEmpresaId });

      if (!grupoEmpresaDeletado) {
        return res.notFound({ message: 'Grupo Empresa não encontrado.' });
      }

      return res.json({
        message: 'Grupo Empresa deletado com sucesso'
      });
    } catch (err) {
      return res.serverError({ message: 'Erro ao deletar grupo empresa', error: err });
    }
  }
};
