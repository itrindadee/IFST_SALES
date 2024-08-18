// api/models/AuditLog/AuditLog.js
module.exports = {
  attributes: {
    model: {
      type: 'string',
      required: true,
      description: 'O nome do modelo que foi alterado.'
    },
    action: {
      type: 'string',
      required: true,
      description: 'A ação realizada (create, update, delete).'
    },
    oldData: {
      type: 'json',
      description: 'Dados antigos antes da atualização ou exclusão.'
    },
    newData: {
      type: 'json',
      description: 'Novos dados após a criação ou atualização.'
    },
    user: {
      type: 'string',
      description: 'O usuário que realizou a operação.'
    }
  }
};
