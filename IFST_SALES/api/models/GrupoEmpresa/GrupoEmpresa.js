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
  }
};
