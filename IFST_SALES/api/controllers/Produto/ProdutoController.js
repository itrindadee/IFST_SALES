const path = require('path');

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
      const { nome, codigo, descricao, preco, ativo, marca, categoria, subcategoria, grupoproduto } = req.body;
      let caminhoImagem = null;

      if (req.file('imagem')) {
        const uploadedFile = await new Promise((resolve, reject) => {
          req.file('imagem').upload({
            dirname: path.resolve(sails.config.appPath, 'assets/uploads')
          }, function (err, uploadedFiles) {
            if (err) return reject(err);
            resolve(uploadedFiles);
          });
        });

        if (uploadedFile.length > 0) {
          caminhoImagem = '/uploads/' + path.basename(uploadedFile[0].fd);
        }
      }

      const novoProduto = await Produto.create({
        nome,
        codigo,
        descricao,
        preco,
        marca,
        categoria,
        subcategoria,
        grupoproduto,
        caminhoImagem,
        ativo: ativo === 'on',
        createdBy: { id: userId, fullName }
      }).fetch();

      await sails.models.log.create({
        model: 'Produto',
        action: 'create',
        newData: novoProduto,
        user: `${userId} - ${fullName}`
      });

      return res.status(201).json({
        success: true,
        message: 'Produto cadastrado com sucesso',
        produto: novoProduto
      });

    } catch (err) {
      return res.serverError({ message: 'Erro ao cadastrar produto.', error: err.message });
    }
  },

  listar: async function (req, res) {
    try {
      const marcas = await Marca.find();
      const categorias = await Categoria.find();
      const subcategorias = await Subcategoria.find();
      const grupoprodutos = await GrupoProduto.find();

      const produtos = await Produto.find()
        .populate('marca')
        .populate('categoria')
        .populate('subcategoria')
        .populate('grupoproduto');

      return res.view('pages/produto/listar', { produtos, marcas, categorias, subcategorias, grupoprodutos });
    } catch (err) {
      return res.serverError({ message: 'Erro ao listar produtos.', error: err.message });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const { nome, codigo, descricao, preco, ativo, marca, categoria, subcategoria, grupoproduto } = req.body;
      const produtoId = req.params.id;

      let caminhoImagem = req.body.caminhoImagem;

      if (req.file('imagem')) {
        const uploadedFile = await new Promise((resolve, reject) => {
          req.file('imagem').upload({
            dirname: path.resolve(sails.config.appPath, 'assets/uploads')
          }, function (err, uploadedFiles) {
            if (err) return reject(err);
            resolve(uploadedFiles);
          });
        });

        if (uploadedFile.length > 0) {
          caminhoImagem = '/uploads/' + path.basename(uploadedFile[0].fd);
        } else {
          caminhoImagem = null; // Caso a imagem não tenha sido enviada
        }
      }

      const updatedData = {
        nome,
        codigo,
        descricao,
        preco,
        marca,
        categoria,
        subcategoria,
        grupoproduto,
        ativo: ativo === 'on',
        updatedBy: { id: userId, fullName }
      };

      if (caminhoImagem !== null) {
        updatedData.caminhoImagem = caminhoImagem;
      }

      const produtoAtualizado = await Produto.updateOne({ id: produtoId }).set(updatedData);

      if (!produtoAtualizado) {
        return res.notFound({ message: 'Produto não encontrado.' });
      }

      await sails.models.log.create({
        model: 'Produto',
        action: 'update',
        oldData: produtoAtualizado,
        newData: produtoAtualizado,
        user: `${userId} - ${fullName}`
      });

      return res.json({ message: 'Produto atualizado com sucesso', produto: produtoAtualizado });

    } catch (err) {
      return res.serverError({ message: 'Erro ao atualizar produto.', error: err.message });
    }
  },

  deletar: async function (req, res) {
    try {
      const { userId, fullName } = await captureUserInfo(req);
      const produtoId = req.params.id;

      const produtoDeletado = await Produto.destroyOne({ id: produtoId });

      if (!produtoDeletado) {
        return res.notFound({ message: 'Produto não encontrado.' });
      }

      await sails.models.log.create({
        model: 'Produto',
        action: 'delete',
        oldData: produtoDeletado,
        user: `${userId} - ${fullName}`
      });

      return res.json({ message: 'Produto deletado com sucesso' });

    } catch (err) {
      return res.serverError({ message: 'Erro ao deletar produto.', error: err.message });
    }
  }
};
