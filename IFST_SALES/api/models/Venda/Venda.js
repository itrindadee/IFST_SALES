// api/models/Venda.js

module.exports = {
  attributes: {
    // Associação com o cliente
    cliente: {
      model: 'cliente',
      required: true,
      description: 'Cliente associado à venda'
    },

    // Produtos vendidos na venda (relacionamento many-to-many com quantidade e preço)
    produtos: {
      collection: 'produto',
      via: 'venda',
      through: 'vendaproduto'
    },

    // Associação com Canal
    canal: {
      model: 'canal',
      description: 'Canal de vendas'
    },

    // Associação com Empresa
    empresa: {
      model: 'empresa',
      description: 'Empresa associada à venda'
    },

    // Associação com Organização de Vendas
    organizacaoVendas: {
      model: 'organizacaovendas',
      description: 'Organização de vendas associada à venda'
    },

    // Data da venda
    dataVenda: {
      type: 'ref',
      columnType: 'datetime',
      required: true,
      description: 'Data em que a venda foi realizada'
    },

    // Valor total da venda
    valorTotal: {
      type: 'number',
      required: true,
      description: 'Valor total da venda'
    },

    // Status da venda (ex: Pendente, Concluída, Cancelada)
    status: {
      type: 'string',
      isIn: ['Pendente', 'Concluída', 'Cancelada'],
      defaultsTo: 'Pendente',
      description: 'Status da venda'
    },

    // Outras informações adicionais
    observacoes: {
      type: 'string',
      description: 'Observações adicionais sobre a venda'
    }
  }
};
