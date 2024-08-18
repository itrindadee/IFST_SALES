/**
 * PoliticaCadastro.js
 *
 * @description :: Um modelo que representa uma política de cadastro.
 */

module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true,
    },
    ativo: {
      type: 'boolean',
      defaultsTo: true,
    },
    campoResultado: {
      type: 'string',
      required: true,
    },
    valorResultado: {
      type: 'string',
      required: true,
    },
    condicoes: {
      collection: 'CondicaoCadastro',
      via: 'politicaCadastro',
    },
  },

  afterCreate: async function (newlyCreatedRecord, proceed) {
    await sails.models.log.create({
      model: 'PoliticaCadastro',
      action: 'create',
      data: newlyCreatedRecord,
      user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
    });
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    await sails.models.log.create({
      model: 'PoliticaCadastro',
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
        model: 'PoliticaCadastro',
        action: 'delete',
        data: record,
        user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
      });
    }
    return proceed();
  }
};
