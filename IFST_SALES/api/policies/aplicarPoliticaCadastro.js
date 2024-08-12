// api/policies/aplicarPoliticaCadastro.js

module.exports = async function(req, res, next) {
  try {
    const { cliente, empresa, organizacaoVendas } = req.body;

    if (!cliente || !empresa || !organizacaoVendas) {
      return res.badRequest('Os dados do cliente, empresa e organização de vendas são obrigatórios.');
    }

    const politicas = await PoliticaCadastro.find({ ativo: true }).populate('condicoes');

    const aplicarCondicoes = (target, condicoes) => {
      let todasCondicoesAtendidas = true;

      condicoes.forEach(condicao => {
        const valorCampo = target[condicao.campo];

        switch (condicao.operador) {
          case '=':
            if (valorCampo !== condicao.valor) todasCondicoesAtendidas = false;
            break;
          case '!=':
            if (valorCampo === condicao.valor) todasCondicoesAtendidas = false;
            break;
          case '>':
            if (parseFloat(valorCampo) <= parseFloat(condicao.valor)) todasCondicoesAtendidas = false;
            break;
          case '<':
            if (parseFloat(valorCampo) >= parseFloat(condicao.valor)) todasCondicoesAtendidas = false;
            break;
          case '>=':
            if (parseFloat(valorCampo) < parseFloat(condicao.valor)) todasCondicoesAtendidas = false;
            break;
          case '<=':
            if (parseFloat(valorCampo) > parseFloat(condicao.valor)) todasCondicoesAtendidas = false;
            break;
          case '&&':
            todasCondicoesAtendidas = todasCondicoesAtendidas && (valorCampo === condicao.valor);
            break;
          case '||':
            todasCondicoesAtendidas = todasCondicoesAtendidas || (valorCampo === condicao.valor);
            break;
          default:
            todasCondicoesAtendidas = false;
        }
      });

      return todasCondicoesAtendidas;
    };

    politicas.forEach(politica => {
      if (aplicarCondicoes(cliente, politica.condicoes)) {
        cliente[politica.campoResultado] = politica.valorResultado;
      }
      if (aplicarCondicoes(empresa, politica.condicoes)) {
        empresa[politica.campoResultado] = politica.valorResultado;
      }
      if (aplicarCondicoes(organizacaoVendas, politica.condicoes)) {
        organizacaoVendas[politica.campoResultado] = politica.valorResultado;
      }
    });

    // Prossiga para o próximo middleware ou ação do controlador
    return next();
  } catch (err) {
    console.error('Erro ao aplicar políticas de cadastro:', err);
    return res.serverError('Erro ao aplicar políticas de cadastro.');
  }
};
