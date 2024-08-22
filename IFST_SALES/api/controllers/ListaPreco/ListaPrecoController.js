// api/controllers/ListaPrecoController.js

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
  listar: async function (req, res) {
    try {
      const listasPreco = await ListaPreco.find().populate('produtos');
      const produtos = await Produto.find();
      return res.view('pages/listaPreco/listar', { listasPreco, produtos });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar as listas de preço',
        error: err
      });
    }
  },

  criar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { nome, descricao, produtos } = req.body;

      const listaPrecoExistente = await ListaPreco.findOne({ nome });
      if (listaPrecoExistente) {
        return res.status(400).json({ type: 'UniqueConstraintError', error: 'A lista de preço já existe' });
      }

      const novaListaPreco = await ListaPreco.create({
        nome,
        descricao,
        createdBy: { id: userId, fullName }
      }).fetch();

      if (produtos && produtos.length > 0) {
        for (let produto of produtos) {
          const novoProduto = await ListaPrecoProduto.create({
            listaPreco: novaListaPreco.id,
            produto: produto.id,
            valor: produto.valor,
            moeda: produto.moeda,
            validade: produto.validade,
            createdBy: { id: userId, fullName }
          }).fetch();

          await ListaPreco.addToCollection(novaListaPreco.id, 'produtos').members([novoProduto.id]);
        }
      }

      return res.status(201).json({
        message: 'Lista de preço criada com sucesso!',
        listaPreco: novaListaPreco
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar a lista de preço',
        error: err
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const listaPrecoId = req.params.id;

      const listaPreco = await ListaPreco.findOne({ id: listaPrecoId }).populate('produtos');
      if (!listaPreco) {
        return res.notFound({
          message: 'Lista de preço não encontrada'
        });
      }

      return res.json({
        listaPreco: listaPreco,
        produtosAssociados: listaPreco.produtos
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar a lista de preço',
        error: err
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { nome, descricao, produtos } = req.body;
      const listaPrecoId = req.params.id;

      const listaPrecoExistente = await ListaPreco.findOne({ nome, id: { '!=': listaPrecoId } });
      if (listaPrecoExistente) {
        return res.status(400).json({ message: 'Nome da lista de preço já existe.' });
      }

      const listaPrecoAtualizada = await ListaPreco.updateOne({ id: listaPrecoId }).set({
        nome,
        descricao,
        updatedBy: { id: userId, fullName }
      });

      if (!listaPrecoAtualizada) {
        return res.notFound({
          message: 'Lista de preço não encontrada'
        });
      }

      if (produtos && produtos.length > 0) {
        await ListaPreco.replaceCollection(listaPrecoId, 'produtos').members(
          produtos.map(produto => ({
            id: produto.id,
            valor: produto.valor,
            moeda: produto.moeda,
            validade: produto.validade
          }))
        );
      } else {
        await ListaPreco.replaceCollection(listaPrecoId, 'produtos').members([]);
      }

      return res.json({
        message: 'Lista de preço atualizada com sucesso!',
        listaPreco: listaPrecoAtualizada
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar a lista de preço',
        error: err
      });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const listaPrecoId = req.params.id;

      const listaPreco = await ListaPreco.findOne({ id: listaPrecoId }).populate('produtos');
      if (!listaPreco) {
        return res.notFound({
          message: 'Lista de preço não encontrada'
        });
      }

      const produtosAssociados = listaPreco.produtos.map(produto => produto.id);

      await ListaPreco.removeFromCollection(listaPrecoId, 'produtos').members(produtosAssociados);

      const listaPrecoDeletada = await ListaPreco.destroyOne({ id: listaPrecoId });

      if (!listaPrecoDeletada) {
        return res.notFound({
          message: 'Lista de preço não encontrada'
        });
      }

      return res.json({
        message: 'Lista de preço deletada com sucesso!'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar a lista de preço',
        error: err
      });
    }
  }
};
