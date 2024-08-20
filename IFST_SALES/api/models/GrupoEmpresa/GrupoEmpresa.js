// api/models/GrupoEmpresa.js

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
        model: 'Grupo Empresa',
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
        model: 'Grupo Empresa',
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
          model: 'Grupo Empresa',
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
