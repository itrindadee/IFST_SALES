// api/models/VendaProduto.js

module.exports = {
  attributes: {
    // Venda associada
    venda: {
      model: 'venda',
      required: true,
      description: 'Venda associada ao produto'
    },

    // Produto associado
    produto: {
      model: 'produto',
      required: true,
      description: 'Produto vendido'
    },

    // Quantidade do produto na venda
    quantidade: {
      type: 'number',
      required: true,
      description: 'Quantidade do produto na venda'
    },

    // Preço do produto na venda (pode variar em relação ao preço padrão)
    preco: {
      type: 'number',
      required: true,
      description: 'Preço do produto na venda'
    }
  }
};
