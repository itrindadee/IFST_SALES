const path = require('path');

module.exports = {
  criar: async function (req, res) {
    try {
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
        ativo: ativo === 'on'
      }).fetch();

      return res.status(201).json({
        success: true,
        message: 'Produto cadastrado com sucesso',
        produto: novoProduto
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Erro ao cadastrar produto.', error: err.message });
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
      return res.serverError({ success: false, message: 'Erro ao listar produtos.', error: err.message });
    }
  },

  atualizar: async function (req, res) {
    try {
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
        }
      }

      const produtoAtualizado = await Produto.updateOne({ id: produtoId }).set({
        nome,
        codigo,
        descricao,
        preco,
        marca,
        categoria,
        subcategoria,
        grupoproduto,
        caminhoImagem,
        ativo: ativo === 'on'
      });

      if (!produtoAtualizado) {
        return res.notFound({ success: false, message: 'Produto não encontrado.' });
      }

      return res.json({ success: true, message: 'Produto atualizado com sucesso', produto: produtoAtualizado });

    } catch (err) {
      return res.serverError({ success: false, message: 'Erro ao atualizar produto.', error: err.message });
    }
  },

  deletar: async function (req, res) {
    try {
      const produtoId = req.params.id;

      const produtoDeletado = await Produto.destroyOne({ id: produtoId });

      if (!produtoDeletado) {
        return res.notFound({ success: false, message: 'Produto não encontrado.' });
      }

      return res.json({ success: true, message: 'Produto deletado com sucesso' });

    } catch (err) {
      return res.serverError({ success: false, message: 'Erro ao deletar produto.', error: err.message });
    }
  }
};
