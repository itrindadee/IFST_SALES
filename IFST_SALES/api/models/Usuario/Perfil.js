// api/models/Perfil.js
module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true,
      unique: true
    },
    descricao: {
      type: 'string'
    },
    permissoes: {
      collection: 'permissao',
      via: 'perfils',
      dominant: true
    },
    usuarios: {
      collection: 'user',
      via: 'perfil'
    }
  },

  afterCreate: async function (newlyCreatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Perfil',
      action: 'create',
      data: newlyCreatedRecord,
      user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
    });
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Perfil',
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
        model: 'Perfil',
        action: 'delete',
        data: record,
        user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
      });
    }
    return proceed();
  }
};
