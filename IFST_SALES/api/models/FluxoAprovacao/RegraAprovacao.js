// api/models/FluxoAprovacao/RegraAprovacao.js

module.exports = {
  attributes: {
    nivel: {
      type: 'number',
      required: true,
    },
    tipo: {
      type: 'string',
      isIn: ['AND', 'OR'],
      required: true,
    },
    fluxo: {
      model: 'FluxoAprovacao',
    },
    aprovadores: {
      collection: 'Aprovador',
      via: 'regra',
    },
  },

  afterCreate: async function (newlyCreatedRecord, proceed) {
    await sails.models.log.create({
      model: 'RegraAprovacao',
      action: 'create',
      data: newlyCreatedRecord,
      user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
    });
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    await sails.models.log.create({
      model: 'RegraAprovacao',
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
        model: 'RegraAprovacao',
        action: 'delete',
        data: record,
        user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
      });
    }
    return proceed();
  }
};
