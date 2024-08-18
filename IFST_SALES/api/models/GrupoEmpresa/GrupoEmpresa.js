// api/models/NomeDoModelo.js

module.exports = {
  attributes: {
    codigo: {
      type: 'string',
      required: true,
      unique: true
    },
    nome: {
      type: 'string',
      required: true
    }
  },

  afterCreate: async function (newlyCreatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Grupo Empresa',  // Substitua pelo nome real do modelo
      action: 'create',
      data: newlyCreatedRecord,
      user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
    });
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Grupo Empresa',  // Substitua pelo nome real do modelo
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
        model: 'Grupo Empresa',  // Substitua pelo nome real do modelo
        action: 'delete',
        data: record,
        user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
      });
    }
    return proceed();
  }
};
