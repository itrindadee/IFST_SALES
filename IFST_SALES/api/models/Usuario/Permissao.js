// api/models/Permissao.js
module.exports = {
  attributes: {
    nome: {
      type: 'string',
      required: true,
      description: 'O nome da permissão, como "Gerenciar Usuários".'
    },

    descricao: {
      type: 'string',
      required: true,
      description: 'Uma descrição detalhada da permissão e o que ela controla.'
    },

    tipoPermissao: {
      type: 'string',
      isIn: ['Criar', 'Editar', 'Listar', 'Deletar', 'Buscar', 'Atualizar'],
      required: true,
      description: 'O tipo de permissão, como "Criar", "Editar", "Listar", "Deletar",  "Buscar", "Atualizar".'
    },

    perfils: {
      collection: 'perfil',
      via: 'permissoes'
    }
  },

  afterCreate: async function (newlyCreatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Permissao',
      action: 'create',
      data: newlyCreatedRecord,
      user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
    });
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    await sails.models.log.create({
      model: 'Permissao',
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
        model: 'Permissao',
        action: 'delete',
        data: record,
        user: 'system'  // Substitua 'system' pelo identificador do usuário real se disponível
      });
    }
    return proceed();
  }
};
