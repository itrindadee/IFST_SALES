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
    marca: {
      model: 'marca',
      required: true
    },
    categoria: {
      model: 'categoria',
      required: true
    },
    subcategoria: {
      model: 'subcategoria',
      required: true
    },
    grupoproduto: {
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
  },

  afterCreate: async function (newlyCreatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Produto',
      action: 'create',
      data: newlyCreatedRecord,
      user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
    });
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Produto',
      action: 'update',
      data: updatedRecord,
      user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
    });
    return proceed();
  },

  afterDestroy: async function (destroyedRecords, proceed) {
    // Garante que destroyedRecords seja sempre um array
    destroyedRecords = Array.isArray(destroyedRecords) ? destroyedRecords : [destroyedRecords];

    for (const record of destroyedRecords) {
      await sails.models.log.create({
        model: 'Produto',
        action: 'delete',
        data: record,
        user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
      });
    }
    return proceed();
  }
};
