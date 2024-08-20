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
    },
    createdBy: {
      type: 'json',
      description: 'ID e nome do usuário que criou o registro',
      defaultsTo: {}
    },
    updatedBy: {
      type: 'json',
      description: 'ID e nome do usuário que atualizou o registro',
      defaultsTo: {}
    }
  },

  // Auditoria após a criação
  afterCreate: async function (newlyCreatedRecord, proceed) {
    try {
      const user = `${newlyCreatedRecord.createdBy.id} - ${newlyCreatedRecord.createdBy.fullName}`;
      await sails.models.log.create({
        model: 'Permissão',
        action: 'create',
        newData: newlyCreatedRecord,
        user: user
      });
    } catch (err) {
      return proceed(err);
    }
    return proceed();
  },

  // Auditoria após a atualização
  afterUpdate: async function (updatedRecord, proceed) {
    try {
      const user = `${updatedRecord.updatedBy.id} - ${updatedRecord.updatedBy.fullName}`;
      await sails.models.log.create({
        model: 'Permissão',
        action: 'update',
        newData: updatedRecord,
        user: user
      });
    } catch (err) {
      return proceed(err);
    }
    return proceed();
  },

  // Auditoria após a exclusão
  afterDestroy: async function (destroyedRecords, proceed) {
    try {
      destroyedRecords = Array.isArray(destroyedRecords) ? destroyedRecords : [destroyedRecords];
      for (const record of destroyedRecords) {
        const user = `${record.updatedBy.id || record.createdBy.id} - ${record.updatedBy.fullName || record.createdBy.fullName}`;
        await sails.models.log.create({
          model: 'Permissão',
          action: 'delete',
          oldData: record,
          user: user
        });
      }
    } catch (err) {
      return proceed(err);
    }
    return proceed();
  }
};
