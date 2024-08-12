// api/models/ClienteEmpresa.js
module.exports = {
  attributes: {
    cliente: {  // Este é o nome da chave estrangeira que liga de volta ao modelo Cliente.
      model: 'cliente'
      },
    empresa: {
      model: 'Empresa',
      required: true
    },
    ctaConcil: { type: 'string' },
    /*
    chaveOrdenacao: { type: 'string' },
    fisYearDocNo: { type: 'string' },
    sede: { type: 'string' },
    autorizacao: { type: 'string' },
    grpAdminTesour: { type: 'string' },
    codigoJuros: { type: 'string' },
    ultimaDataFixada: { type: 'string' },
    periodJuros: { type: 'string' },
    ultCalcJuros: { type: 'string' },
    numAntigoConta: { type: 'string' },
    assocCompras: { type: 'string' },
    condicaoPagamento: { type: 'string' },
    grpTolerancia: { type: 'string' },
    notaCreditoCondPgto: { type: 'string' },
    convenioFerias: { type: 'string' },
    despLetraCambioCondPgto: { type: 'string' },
    codigoCessao: { type: 'string' },
    historicoPagamento: { type: 'boolean' },
    formasPgto: { type: 'string' },
    bloqPagamento: { type: 'string' },
    pagadorDivergente: { type: 'string' },
    bancoEmpresa: { type: 'string' },
    limiteLC: { type: 'string' },
    chvAgrupamento: { type: 'string' },
    pagamentoIndividual: { type: 'boolean' },
    avisoPgtoViaEDI: { type: 'boolean' },
    pagadorAlternativo: { type: 'boolean' },
    convMotivoDif: { type: 'string' },
    regraSelecao: { type: 'string' },
    responsContab: { type: 'string' },
    ctaNoCliente: { type: 'string' },
    encarregClient: { type: 'string' },
    telefRespons: { type: 'string' },
    telefaxRespons: { type: 'string' },
    internetResp: { type: 'string' },
    observNaConta: { type: 'string' },
    extratoDaConta: { type: 'string' },
    varianteDeFaturaColet: { type: 'string' },
    clienteCIC: { type: 'boolean' },
    clienteSIC: { type: 'boolean' },
    sd: { type: 'boolean' },
    contabilidade: { type: 'boolean' },
    dptoJuridico: { type: 'boolean' },
    numContrato: { type: 'string'},
    numAseguradora: { type: 'string' },
    montanteSegurado: { type: 'string' },
    validoAte: { type: 'ref', columnType: 'datetime' },
    mesesPrazo: { type: 'number' },
    franquia: { type: 'string' },
    ctgIRF: { type: 'string' },
    codigo: { type: 'string' },
    retIRF: { type: 'boolean' },
    autDedDe: { type: 'ref', columnType: 'datetime' },
    autDedAte: { type: 'ref', columnType: 'datetime' },
    numIRF: { type: 'string', unique: true },
    numCertIsencao: { type: 'string' },
    taxa: { type: 'string' },
    moeda: { type: 'string' },
    procedAdver: { type: 'string' },
    destinAdver: { type: 'string' },
    ultimaAdver: { type: 'string' },
    responsAdverts: { type: 'string' },
    bloqAdver: { type: 'string' },
    procJudCobr: { type: 'string' },
    nivCobranca: { type: 'string' },
    */
  },
};
