module.exports = async function (req, res, proceed) {
  try {
    if (!req.session.userId) {
      return res.redirect('/login');
    }

    // Carrega o usuário e popula o perfil e as permissões associadas ao perfil
    const user = await User.findOne({ id: req.session.userId }).populate('perfil');

    if (!user || !user.perfil) {
      return res.status(403).json({
        error: "Você não possui permissão para isso", // A mensagem de erro
        type: "Forbidden" // O tipo de erro
      });
    }

    // Popula as permissões do perfil após ter populado o perfil
    const perfil = await Perfil.findOne({ id: user.perfil.id }).populate('permissoes');

    if (!perfil || !Array.isArray(perfil.permissoes)) {
      return res.status(403).json({
        error: "Você não possui permissão para isso", // A mensagem de erro
        type: "Forbidden" // O tipo de erro
      });
    }

    const actionParts = req.options.action.split('/');
    const action = actionParts[actionParts.length - 1].charAt(0).toUpperCase() + actionParts[actionParts.length - 1].slice(1);
    const moduleName = 'Canal';

    console.log(`Verificando permissão para ação: ${action} no módulo: ${moduleName}`);

    const hasPermission = await Permissao.findOne({
      nome: `${action} ${moduleName}`
    });

    if (!hasPermission) {
      console.log(`Permissão não encontrada: ${action} ${moduleName}`);
      return res.status(403).json({
        error: "Você não possui permissão para isso", // A mensagem de erro
        type: "Forbidden" // O tipo de erro
      });
    }

    // Verifica se o perfil do usuário inclui a permissão
    if (!perfil.permissoes.some(permissao => permissao.id === hasPermission.id)) {
      console.log(`Usuário não tem permissão: ${hasPermission.id}`);
      return res.status(403).json({
        error: "Você não possui permissão para isso", // A mensagem de erro
        type: "Forbidden" // O tipo de erro
      });
    }

    return proceed();

  } catch (err) {
    console.error('Erro no processo de autorização:', err);
    return res.status(500).json({
      error: {
        message: "Erro no processo de autorização.",
        type: "ServerError",
        details: err.message
      }
    });
  }
};
