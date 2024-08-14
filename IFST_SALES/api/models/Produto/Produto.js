// api/models/Produto.js
module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true
    },
    codigo: {
      type: 'string',
      required: true,
      unique: true
    },
    marca: {  // Este é o nome da chave estrangeira que liga de volta ao modelo Cliente.
      model: 'marca',
      required: true
      },
    categoria: {  // Este é o nome da chave estrangeira que liga de volta ao modelo Cliente.
      model: 'categoria',
      required: true
      },
    subcategoria: {  // Este é o nome da chave estrangeira que liga de volta ao modelo Cliente.
      model: 'subcategoria',
      required: true
        },
    grupoproduto: {  // Este é o nome da chave estrangeira que liga de volta ao modelo Cliente.
      model: 'grupoproduto',
      required: true
          },
    descricao: {
      type: 'string',
      required: true
    },
    preco: {
      type: 'number',
      required: true
    },
    caminhoImagem: {
      type: 'string',
      allowNull: true
    },
    ativo: {
      type: 'boolean',
      defaultsTo: true
    }
  }
};
