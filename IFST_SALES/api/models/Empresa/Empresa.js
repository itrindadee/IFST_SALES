// api/models/Empresa.js
module.exports = {
  attributes: {
    codigo: {
      type: 'string',
      required: true,
      unique: true
    },
    razaoSocial: {
      type: 'string',
      required: true
    },
    cnpj: {
      type: 'string',
      required: true,
      unique: true
    },
    endereco: {
      type: 'string'
    }
  },

  afterCreate: async function (newlyCreatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Empresa',
      action: 'create',
      data: newlyCreatedRecord,
      user: 'system'  // Substitua 'system' por identificador do usuário real se disponível
    });
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Empresa',
      action: 'update',
      data: updatedRecord,
      user: 'system'  // Substitua 'system' por identificador do usuário real se disponível
    });
    return proceed();
  },

  afterDestroy: async function (destroyedRecords, proceed) {
    // Garante que destroyedRecords seja sempre um array
    destroyedRecords = Array.isArray(destroyedRecords) ? destroyedRecords : [destroyedRecords];

    for (const record of destroyedRecords) {
      await sails.models.log.create({
        model: 'Empresa',
        action: 'delete',
        data: record,
        user: 'system'  // Substitua 'system' por identificador do usuário real se disponível
      });
    }
    return proceed();
  }
};
