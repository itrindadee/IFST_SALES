// api/models/PerfilPermissao.js

module.exports = {
  attributes: {
    // Adicione os atributos necessários para sua tabela intermediária
    // Por exemplo, você pode adicionar atributos como 'perfilId' e 'permissaoId'
    perfilId: {
      model: 'Perfil'
    },
    permissaoId: {
      model: 'Permissao'
    }
  }
};
