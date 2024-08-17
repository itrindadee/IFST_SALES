module.exports = {
  listar: async function (req, res) {
    try {
      const regioes = await Regiao.find();
      return res.view('pages/regiao/listar', { regioes });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar as regiões.',
        error: err
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const regiao = await Regiao.findOne({ id: req.params.id });
      if (!regiao) {
        return res.notFound({
          message: 'Região não encontrada.'
        });
      }
      return res.json(regiao);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar a região.',
        error: err
      });
    }
  },

  buscarPorDescricao: async function (req, res) {
    try {
      const termo = req.query.termo || '';
      const regioesVendas = await Regiao.find({
        where: { descricao: { contains: termo } },
        limit: 10
      });
      return res.json(regioesVendas);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar regiões por descrição.',
        error: err
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { organizacaoVendas, codigo, descricao } = req.body;
      const novaRegiao = await Regiao.create({
        organizacaoVendas,
        codigo,
        descricao
      }).fetch();
      return res.status(201).json({
        message: 'Região criada com sucesso',
        regiao: novaRegiao
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar a região.',
        error: err
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { organizacaoVendas, codigo, descricao } = req.body;
      const regiaoId = req.params.id;

      const regiaoAtualizada = await Regiao.updateOne({ id: regiaoId }).set({
        organizacaoVendas,
        codigo,
        descricao
      });

      if (!regiaoAtualizada) {
        return res.notFound({
          message: 'Região não encontrada.'
        });
      }

      return res.json({
        message: 'Região atualizada com sucesso',
        regiao: regiaoAtualizada
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar a região.',
        error: err
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const regiaoId = req.params.id;

      const regiaoDeletada = await Regiao.destroyOne({ id: regiaoId });

      if (!regiaoDeletada) {
        return res.notFound({
          message: 'Região não encontrada.'
        });
      }

      return res.json({
        message: 'Região deletada com sucesso'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar a região.',
        error: err
      });
    }
  }
};
