module.exports = {
  attributes: {
    codigo: {
      type: 'string',
      required: true,
      unique: true
    },
    descricao: {
      type: 'string',
      required: true
    },
    ativo: {
      type: 'boolean',
      defaultsTo: true
    }
  },
};
